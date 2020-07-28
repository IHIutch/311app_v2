import express from "express";
import { Report } from "../models/index";

const router = express.Router();

router.get("/", (req, res) => {
  Report.findAll({
    limit: 100
  })
    .then(reports => {
      if (reports) {
        res.json(reports);
      } else {
        res.json([]);
      }
    })
    .catch(err => console.log(err));
});

router.get("/:reportId/", (req, res) => {
  const reportId = req.params.reportId;

  Report.findByPk(reportId)
    .then(report => {
      res.json(report);
    })
    .catch(err => console.log(err));
});

export default router;
