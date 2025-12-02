// routes/todoRoutes.js
const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/todos  -> get all todos for user
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/todos  -> create todo
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const todo = await Todo.create({
      user: req.user.id,
      title,
      completed: false
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error("Create todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/todos/:id  -> update (title / completed)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    const updated = await todo.save();
    res.json(updated);
  } catch (err) {
    console.error("Update todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/todos/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
