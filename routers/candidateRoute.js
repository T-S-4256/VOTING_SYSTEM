const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User = require("../models/user");

const { jwtMiddleWare, generateToken } = require("../jwt");

//FUNCTION TO CHECK THE USER IS ADMIN OR NOT ??
const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user.role === 'admin';
    }
    catch (err) {
        return false;
    }
}

//ADD NEW CANDIDATE ROUTE

router.post('/', jwtMiddleWare, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id)))
            return res.status(403).json({ massage: "Unauthorised Person" });
        const data = req.body;
        console.log("data is  : ", data);
        const newUser = await new Candidate(data);
        //SAVING USER INTO DATABASE
        const savedUser = await newUser.save();
        console.log("NEW CANDIDATE ADDED");
        res.status(200).json({ response: savedUser });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        return res.status(500).json({ err: "Internal Server Error" });
    }
})


//CANDIDATE DATA UPDATE  ROUTE

router.put('/:candidateId', jwtMiddleWare, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) return res.status(403).json({ massage: "Unauthorised Person" });

        const userId = req.params.candidateId;
        const updateData = req.body;

        const response = await Candidate.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        })
        if (!response) return res.status(404).json({ massage: "Candidate Not Found" });

        console.log("CANDIDATE DATA UPDATED");
        res.status(200).json(response);
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})


//DELETE CANDIDATE ROUTE 

router.delete('/:candidateId', jwtMiddleWare, async (req, res) => {
    try {
        if (!(await checkAdminRole(req.user.id))) return res.status(403).json({ massage: "Unauthorised Person" });

        const candidateId = req.params.candidateId;
        const response = await Candidate.findByIdAndDelete(candidateId);
        if (!response) return res.status(404).json({ massage: "Candidate Not Found" });
        console.log("CANDIDATE DELETED");
        res.status(200).json({ response });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})


//VOTE ROUTE

router.post('/:candidateId', jwtMiddleWare, async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const voterId = req.user.id;
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ massage: "Candidate Not found" });
        const voter = await User.findById(voterId);
        if (!voter) return res.status(404).json({ massage: "Voter Not Found" });
        if (voter.role === 'admin') return res.status(403).json({ massage: "Admin is not Allowed To Vote" });
        if (voter.isVoted == true) return res.status(403).json({ massage: "You Have Already Voted" });
        candidate.votes.push({ user: voterId });
        candidate.voteCount++;
        await candidate.save();

        voter.isVoted = true;
        await voter.save();
        res.status(200).json({ massage: "User Voted Successfully" });
    }
    catch (err) {
        console.log("Internal Server Error : ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})

//VOTE COUNT ROUTE
router.get('/vote/count', async (req, res) => {
    try {
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });
        const records = candidate.map((data) => {
            return {
                Party: data.party,
                TotalCote: data.voteCount
            }
        });
        res.status(200).json(records)
    }
    catch (err) {
        console.log("Internal Server Error ", err);
        res.status(500).json({ err: "Internal Server Error" });
    }
})






module.exports = router;