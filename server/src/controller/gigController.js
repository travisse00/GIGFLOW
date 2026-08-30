const Gig = require("../models/Gig");

const createGig = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({
        message: "Title, description, price and category are required"
      });
    }

    if (req.user.role !== "freelancer") {
      return res.status(403).json({
        message: "Only freelancers can create gigs"
      });
    }

    const gig = await Gig.create({
      title,
      description,
      price,
      category,
      image,
      freelancer: req.user.userId
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


const getGigs = async (req, res) => {
  try {
    const gigs = await Gig.find()
      .populate(
        "freelancer",
        "name email profileImage username"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error("GET GIGS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


const getGig = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id)
      .populate("freelancer", "name email bio profileImage");

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    res.json({
      gig
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const updateGig = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, image } = req.body;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    // Make sure the logged-in user owns the gig
    if (gig.freelancer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own gigs"
      });
    }

    gig.title = title ?? gig.title;
    gig.description = description ?? gig.description;
    gig.price = price ?? gig.price;
    gig.category = category ?? gig.category;
    gig.image = image ?? gig.image;

    await gig.save();

    res.json({
      message: "Gig updated successfully",
      gig
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

const deleteGig = async (req, res) => {
  try {
    const { id } = req.params;

    const gig = await Gig.findById(id);

    if (!gig) {
      return res.status(404).json({
        message: "Gig not found"
      });
    }

    if (gig.freelancer.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own gigs"
      });
    }

    await gig.deleteOne();

    res.json({
      message: "Gig deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createGig,
  getGigs,
  getGig,
  updateGig,
  deleteGig
};