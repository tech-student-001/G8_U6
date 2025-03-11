document.addEventListener("DOMContentLoaded", () => {
    const noteTitle = document.getElementById("note-title");
    const noteContent = document.getElementById("note-content");
    const saveNoteButton = document.getElementById("save-note");
    const clearNotesButton = document.getElementById("clear-notes");
    const notesList = document.getElementById("notes-list");
    const toggleDarkModeButton = document.getElementById("toggle-dark-mode");
    const searchNotes = document.getElementById("search-notes");
    const body = document.body;
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="modal-content">
        <span id="modal-title"></span>
        <span id="modal-date"></span>
        <p id="modal-body"></p>
        <button id="close-modal">Close</button>
    </div>`;
    document.body.appendChild(modal);

    document.getElementById("close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    AWS.config.update({
        accessKeyId: "ACCESS_KEY_ID", 
        secretAccessKey: "SECRET_ACCESS_KEY", 
        region: "Region"
    });

    const s3 = new AWS.S3();
    const BUCKET_NAME = "g8-u6-notes-app-storage";
    const NOTES_FILE = "notes.json";

    const loadNotes = (filter = "") => {
        const params = { Bucket: BUCKET_NAME, Key: NOTES_FILE };
        s3.getObject(params, (err, data) => {
            if (err && err.code === "NoSuchKey") {
                saveNotesToS3([]);
                return;
            }
            if (err) return console.error("Error loading notes:", err);
            
            let notes = [];
            try { notes = JSON.parse(data.Body.toString("utf-8")); }
            catch (e) { console.error("Error parsing JSON:", e); }

            notesList.innerHTML = "";
            notes.forEach((note, index) => {
                if (note.title.toLowerCase().includes(filter.toLowerCase())) {
                    const noteItem = document.createElement("li");
                    noteItem.classList.add("note-item");
                    noteItem.innerHTML = `
                        <span class="view-note" data-index="${index}">${note.title}</span>
                        <button class="delete-btn" data-index="${index}">X</button>
                    `;
                    notesList.appendChild(noteItem);
                }
            });
        });
    };

    const saveNote = () => {
        if (!noteTitle.value.trim() || !noteContent.value.trim()) {
            alert("⚠️ Please enter both title and content!");
            return;
        }
        
        const newNote = { title: noteTitle.value.trim(), content: noteContent.value.trim() };
        const params = { Bucket: BUCKET_NAME, Key: NOTES_FILE };

        s3.getObject(params, (err, data) => {
            let notes = [];
            if (!err && data.Body) {
                try { notes = JSON.parse(data.Body.toString("utf-8")); }
                catch (e) { console.error("Error parsing JSON:", e); }
            }
            notes.push(newNote);
            saveNotesToS3(notes);
        });
    };

    const saveNotesToS3 = (notes) => {
        const params = {
            Bucket: BUCKET_NAME,
            Key: NOTES_FILE,
            Body: JSON.stringify(notes),
            ContentType: "application/json"
        };
        s3.putObject(params, (err) => {
            if (err) console.error("Error saving notes:", err);
            else loadNotes();
        });
    };

    const viewNote = (index) => {
        const params = { Bucket: BUCKET_NAME, Key: NOTES_FILE };
        s3.getObject(params, (err, data) => {
            if (err) return console.error("Error loading notes:", err);
            
            let notes = [];
            try { notes = JSON.parse(data.Body.toString("utf-8")); }
            catch (e) { console.error("Error parsing JSON:", e); }

            if (notes[index]) {
                document.getElementById("modal-title").textContent = notes[index].title;
                document.getElementById("modal-body").textContent = notes[index].content;
                modal.style.display = "block";
            }
        });
    };

    const deleteNote = (index) => {
        if (!confirm("Are you sure you want to delete this note?")) return;
        const params = { Bucket: BUCKET_NAME, Key: NOTES_FILE };
        s3.getObject(params, (err, data) => {
            if (err) return console.error("Error loading notes:", err);
            
            let notes = [];
            try { notes = JSON.parse(data.Body.toString("utf-8")); }
            catch (e) { console.error("Error parsing JSON:", e); }
            
            notes.splice(index, 1);
            saveNotesToS3(notes);
        });
    };

    const deleteAllNotes = () => {
        if (!confirm("⚠️ Are you sure you want to delete ALL notes?")) return;
        saveNotesToS3([]);
    };

    notesList.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("view-note")) viewNote(target.dataset.index);
        else if (target.classList.contains("delete-btn")) deleteNote(target.dataset.index);
    });

    searchNotes.addEventListener("input", () => loadNotes(searchNotes.value));
    toggleDarkModeButton.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", body.classList.contains("dark-mode"));
    });
    if (localStorage.getItem("darkMode") === "true") body.classList.add("dark-mode");

    saveNoteButton.addEventListener("click", saveNote);
    clearNotesButton.addEventListener("click", deleteAllNotes);

    loadNotes();
});
