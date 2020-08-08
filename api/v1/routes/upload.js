import express from "express";
import uploadToS3 from "../aws";

const router = express.Router();

router.post("/", (req, res) => {
  const { base64String, fileType } = req.body;
  uploadToS3(base64String, fileType);
});

export default router;
