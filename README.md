# Notes App

## Overview
This is a simple Notes App that allows users to create, view, search, and delete notes. The notes are stored in an AWS S3 bucket as a JSON file, ensuring persistence across sessions. The app also supports a dark mode toggle.

## Features
- Add new notes with a title and content.
- View notes in a pop-up modal.
- Search notes by title.
- Delete individual notes or clear all notes.
- Dark mode support with local storage persistence.
- AWS S3 integration for data storage.

## Technologies Used
- **JavaScript**: Frontend logic and interactivity.
- **AWS S3**: Cloud storage for notes.
- **HTML & CSS**: UI design and styling.

## Setup Instructions
1. Clone the repository or download the files.
2. Open `index.html` in a web browser.
3. Make sure you have AWS credentials configured for S3 access.
4. Update `AWS.config.update()` with your `accessKeyId`, `secretAccessKey`, and `region`.
5. Ensure the `BUCKET_NAME` matches your S3 bucket.
6. Use the app to add, view, and manage notes.

## Usage
- **Adding a Note**: Enter a title and content, then click "Save Note".
- **Viewing a Note**: Click on a note title to open it in a modal.
- **Deleting a Note**: Click the "X" button next to a note.
- **Clearing All Notes**: Click "Clear All Notes" (confirmation required).
- **Dark Mode**: Click the dark mode toggle button to switch themes.

## AWS S3 Configuration
- Ensure your S3 bucket allows read and write access for your credentials.
- The notes are stored in `notes.json` within the bucket.

## Security Considerations
- **Do not hardcode sensitive credentials** in production. Use AWS IAM roles or environment variables.
- **Enable proper CORS policies** for secure S3 access.

## Future Improvements
- User authentication for private notes.
- Rich text support for notes.
- Improved UI design.
- Mobile responsiveness.

## License
This project is open-source. Modify and use it as needed!
