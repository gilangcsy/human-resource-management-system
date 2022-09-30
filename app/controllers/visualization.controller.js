const db = require('../models/index.model')
const User = db.user
const Role = db.role
const Leave = db.leave
const Claim = db.claim

module.exports = {
    async readGenderAndRoleCount(req, res, next) {
        try {
            let men = 0
            let women = 0
            let roleArray = []
            let roleHeader = []
            const userData = await User.findAll({
                where: {
                    deletedAt: null
                },
                attributes: ['id', 'gender'],
                include: [
                    {
                        model: Role,
                        attributes: ['id', 'name']
                    },
                ]
            })
    
            const roleData = await Role.findAll({
                where: {
                    deletedAt: null
                },
                attributes: ['id', 'name'],
                include: [
                    {
                        model: User,
                        attributes: ['id']
                    },
                ]
            })
    
            roleData.forEach((item, index) => {
                roleHeader.push(item.name)
                roleArray.push(item.Users.length)
            })
    
            userData.forEach((item) => {
                men = item.gender == 'L' ? men + 1 : men + 0
                women = item.gender == 'P' ? women + 1 : women + 0
            })
            
            let gender = {
                men: men,
                women: women
            }
    
            let role = {
                header: roleHeader,
                role: roleArray
            }
    
            let data = {
                total: userData.length,
                gender: gender,
                role: role
            }
            res.status(200).send({
                success: true,
                message: "Get Gender and Role Count has been successfully.",
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    },

    async readLeaveAndClaimCount(req, res, next) {
        try {
            let today = new Date()
            const leaveData = await Leave.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'created_at'],
            })

            let thisYear = today.getFullYear()

            let leaveCount = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
                10: [],
                11: [],
            }

            leaveData.forEach((item, index) => {
                if(item.created_at.getFullYear() == thisYear) {
                    for (let i = 0; i < 12; i++) {
                        if(item.created_at.getMonth() == i) {
                            leaveCount[i].push(item.id)
                        }
                    }
                }
            })

            let leave = {
                Jan: leaveCount[0].length,
                Feb: leaveCount[1].length,
                Mar: leaveCount[2].length,
                Apr: leaveCount[3].length,
                May: leaveCount[4].length,
                Jun: leaveCount[5].length,
                Jul: leaveCount[6].length,
                Aug: leaveCount[7].length,
                Sep: leaveCount[8].length,
                Oct: leaveCount[9].length,
                Nov: leaveCount[10].length,
                Des: leaveCount[11].length
            }


            const claimData = await Claim.findAll({
                where: {
                    deleted_at: null
                },
                attributes: ['id', 'created_at'],
            })

            let claimCount = {
                0: [],
                1: [],
                2: [],
                3: [],
                4: [],
                5: [],
                6: [],
                7: [],
                8: [],
                9: [],
                10: [],
                11: [],
            }

            claimData.forEach((claim) => {
                if(claim.created_at.getFullYear() == thisYear) {
                    for (let i = 0; i < 12; i++) {
                        if(claim.created_at.getMonth() == i) {
                            claimCount[i].push(claim.id)
                        }
                    }
                }
            })

            let claim = {
                Jan: claimCount[0].length,
                Feb: claimCount[1].length,
                Mar: claimCount[2].length,
                Apr: claimCount[3].length,
                May: claimCount[4].length,
                Jun: claimCount[5].length,
                Jul: claimCount[6].length,
                Aug: claimCount[7].length,
                Sep: claimCount[8].length,
                Oct: claimCount[9].length,
                Nov: claimCount[10].length,
                Des: claimCount[11].length
            }

            let data = {
                leave: leave,
                claim: claim
            }

            res.status(200).send({
                success: true,
                status: 'Get Count Claim and Leave data has been successfully.',
                data: data
            })
        }
        catch (err) {
            next(err)
        }
    }
}