const mongoose = require('mongoose');

const UserExpiryDetails = mongoose.Schema({
	  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    isUnlimited: {type: Boolean, default: false},
    expiryDate: {type: Date},
    startDate: {type: Date, default: Date.now()},
    history: [{
        isFreeAccess: {type: Boolean, default: false},
        expiryDate: {type: Date},
        startDate: {type: Date},
        updatedAt: {type: Date},
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
        },
    }]
}, 
{
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
  );

module.exports = mongoose.model('UserExpiryDetails', UserExpiryDetails);
