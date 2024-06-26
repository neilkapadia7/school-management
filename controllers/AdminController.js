const Syllabus = require("@models/SchoolDetails/Syllabus");
const Students = require("@models/SchoolDetails/Students");
const Users = require("@models/Users/User");
const UserExpiryDetails = require("@models/Users/UserExpiry");
const Batches = require("@models/SchoolDetails/Batches");
const Attendance = require('@models/SchoolDetails/Attendance');
const LiveClasses = require('@models/SchoolDetails/LiveClasses');
const Institute = require('@models/Institute');
const bcrypt = require('bcryptjs');


let accessTypes = ["Instructor", "InstituteAdmin", "BatchAdmin"];

module.exports = {
    // GET api/admin/getAllUsers
    // GET api/auth/getAllUsers
    async getAllUsers(req, res) {
        try {
            let query = {};
            if(!req.isAdminUser) {
                if(!req.instituteId) {
                    return res.status(400).json({data: [], message: "Invalid Access"})
                }

                if (req.accessType == "InstituteAdmin") {
                    query = {instituteId: req.instituteId};
                } 
                else if(req.accessType == "BatchAdmin") {
                    query = {batchId: req.batchId};
                }
            }
            let user = await Users.find(query).populate('batchId instituteId', 'name').select("-password");
            if(!user[0]) {
                return res.status(400).json({message: "No Users Found"});
            }

            return res.status(200).json({data: user, message: "Success"});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },

    // POST  api/admin/addNewUser
    async addNewUser(req, res) {
        try {
            let {name, email, password, isFreeUser, referralCode, isPremiumUser, accessType, isAdminUser, instituteId, expiryDate, isUnlimited} = req.body;
            let user = await Users.findOne({email});
            if(user) {
                return res.status(400).json({message: "User With Email ID Already Exists"});
            }

            let newAccount = new Users({email, name});

            if(referralCode) {
                let checkReferralValid = await Users.findOne({referralCode});
                if(!checkReferralValid) {
                    return res.status(400).json({message: "Invalid Referral Code"});
                }
                newAccount.referredBy = checkReferralValid._id;
            }

            const salt = await bcrypt.genSalt(10);

			let newPassword = await bcrypt.hash(password, salt);
            newAccount.password = newPassword;

            if(isFreeUser) {
                newAccount.isFreeUser = isFreeUser;
            }
            
            if(isPremiumUser) {
                newAccount.isPremiumUser = isPremiumUser;
            }
            
            if(isAdminUser) {
                newAccount.isAdminUser = isAdminUser;
            }
            
            let checkInstitute;
            if(instituteId) {
                checkInstitute = await Institute.findById(instituteId);
                if(!checkInstitute) {
                    return res.status(400).json({message: "Invalid Institute"});
                }
                newAccount.instituteId = instituteId;
            }
            
            if(accessTypes.includes(accessType)) {
                newAccount.accessType = accessType;
            }

            await newAccount.save();


            if(accessType == 'Instructor' || accessType == 'BatchAdmin') {
                checkInstitute.instructorList.push(newAccount._id);
            } else if(accessType == 'InstituteAdmin') {
                checkInstitute.adminId = newAccount._id;
            }

            await checkInstitute.save();

            let startDate = new Date();
            let expiry = new UserExpiryDetails({
                expiryDate,
                isUnlimited,
                startDate: startDate,
                userId: newAccount._id,
                history: [
                    {
                        isFreeAccess: isFreeUser,
                        expiryDate: expiryDate,
                        startDate: startDate,
                    }
                ]
            }).save();

            return res.status(200).json({data: newAccount, message: "Success"});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },

    // POST    api/admin/updateAccess
    async updateUserAccess(req, res) {
        try {
            let {userId, expiryDate, terminateAccess} = req.body;

            let user = await Users.findById(userId);
            if(!user) {
                return res.status(400).json({message: "User Not Found!"})
            }

            if(expiryDate) {
                if(expiryDate < new Date()) {
                    return res.status(400).json({message: "End date cannot be less than current date"});
                }
    
                let userAccess = await UserExpiryDetails.findOne({userId});
                if(!userAccess) {
                    return res.status(400).json({message: "No Access Data Found!"});
                }

                userAccess.expiryDate = expiryDate;
                userAccess.history.push({
                    expiryDate,
                    startDate,
                    updatedAt: new Date(),
                    updatedBy: req.userId
                });

                await userAccess.save();
            }
            

            if(req.body.hasOwnProperty("terminateAccess")) {
                user.isActive = !terminateAccess;
                if(terminateAccess) {
                    user.revokedOn = new Date();
                } else {
                    user.revokedOn = undefined;
                }
                await user.save();
                return res.status(200).json({message: 'Success', data: []});
            }

            
            
            return res.status(200).json({message: 'Success', data: user});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },


    // Institutes ----------------------------------------------------------------------------------------------------------------
    // api/admin/getAllInstitute
    async getAllInstitute(req, res) {
        try {
            let { page, search, isCSV } = req.body;
            
            let query = {};

            if(search) {
                query = {...query, name: { $regex: new RegExp(search, 'i') } };
            }

            let pageNo = 1;
            if (page) {
                pageNo = page;
            }

            let total = await Institute.countDocuments(query);
            let institutes = await Institute.find(query)
            .populate('adminId', "_id name")
            .skip(25 * pageNo - 25)
            .limit(isCSV ? total : 25)
            .sort({createdAt:-1})
            .lean(); 

            res.status(200).json({data: institutes, message: "Success"});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },


    // POST    api/admin/addInstitute
    async addInstitute(req, res) {
        try {
            let {image, name, adminId} = req.body;

            let checkInstitute = await Institute.findOne({name, isActive: true});

            if(checkInstitute) {
                return res.status(400).json({message: "Institute Already Exists"});
            }

            let user = await Users.findById(adminId);
            if(!user) {
                return res.status(400).json({message: "User Not Found!"})
            }

            let newInstitute = await new Institute({
                image,
                name,
                adminId
            }).save();


            return res.status(200).json({message: 'Success', data: newInstitute});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },
    
    // POST    api/admin/updateInstitute
    async updateInstitute(req, res) {
        try {
            let {instituteId, image, name, adminId, instructorList, isActive} = req.body;
            if(!adminId) {
                adminId = req.userId;
            }

            let checkInstitute = await Institute.findById(instituteId);

            if(!checkInstitute) {
                return res.status(400).json({message: "Institute Does not exist"});
            }

            let user = await Users.findById(adminId);
            if(!user) {
                return res.status(400).json({message: "User Not Found!"});
            }

            if("isActive" in req.body) {
                checkInstitute.isActive = isActive;
            }

            if(req.body.hasOwnProperty(image)) {
                checkInstitute.image = image;
            }

            if(req.body.hasOwnProperty(name)) {
                checkInstitute.name = name;
            }

            if(req.body.hasOwnProperty(instructorList)) {
                for (let instructor of instructorList) {
                    let getInstructorUser = await Users.findById(instructor);
                    if(!getInstructorUser || getInstructorUser.accessType !== 'Instructor') {
                        return res.status(400).json({message: "Invalid Instrutor Access"});
                    }
                }
                checkInstitute.instructorList = instructorList;
            }

            if(req.body.hasOwnProperty(adminId)) {
                checkInstitute.adminId = adminId;
            }

            await checkInstitute.save();

            return res.status(200).json({message: 'Success', data: checkInstitute});
        } catch (error) {
            console.error(err.message);
			res.status(500).json({ message: 'Server Error' }); 
        }
    },
}