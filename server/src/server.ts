import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const server = express();
const port = process.env.PORT || 3000;
const uploadsDir = "./uploads";

// Set up the file upload middleware
const storage = multer.diskStorage({
	destination: uploadsDir,
	filename: (_req, file, cb) => {
		cb(null, new Date().toISOString() + "-" + file.originalname);
	}
});

const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif"];
		const ext = path.extname(file.originalname).toLowerCase();
		if (allowedExtensions.includes(ext)) {
			cb(null, true);
		} else {
			cb(new Error(`File type not allowed: ${ext}`));
		}
	}
});

// Note: the server must be in src/ so that when compiled to dist/ the uploads directory is in the correct location
let frontend_path = path.join(__dirname, "../dist");

if (process.env.NODE_ENV === "production") {
	console.log("Running in production mode");
}

console.log("Serving frontend from:", frontend_path);

// Serve the frontend at the root path
server.use(express.static(frontend_path));

// POST endpoint for file uploads
server.post("/upload", upload.single("file"), (req: Request, res: Response) => {
	console.info("Received request:", req.headers["user-agent"]);

	if (!req.file) {
		return res.status(400).send("No file uploaded.");
	}

	// get a random file from the uploads directory
	fs.readdir(uploadsDir, (err, files) => {
		if (err) {
			console.error("Error reading uploads directory:", err);
			return res.status(500).send("Internal Server Error");
		}

		// Filter out the uploaded file and any non-file entries
		const otherFiles = files.filter(
			file =>
				file !== req.file?.filename && !path.extname(file).includes("/")
		);

		if (otherFiles.length === 0) {
			console.error("uploads directory is empty. no files to serve.");
			return res.status(404).send("No other files found.");
		}

		const index = Math.floor(Math.random() * otherFiles.length);
		console.log(
			"Choosing file ",
			index,
			" from ",
			otherFiles.length,
			" files"
		);

		// Select a random file from the remaining files
		const randomFile = path.join(
			__dirname,
			"../",
			uploadsDir,
			otherFiles[Math.floor(Math.random() * otherFiles.length)]
		);
		console.log("Sending file:", randomFile);

		// Send the random file as the response
		res.sendFile(randomFile, err => {
			if (err) {
				console.error("Error sending file:", err);
				return res.status(500).send("Internal Server Error");
			}
		});
	});
});

server.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
