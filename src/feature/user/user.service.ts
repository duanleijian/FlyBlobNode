/* eslint-disable indent */
/* eslint-disable prettier/prettier */

import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { getJSONResult, JSONResult } from '../../utils/result';
import { AES_ECB_DECRYPT, AES_ECB_ENCRYPT } from '../../utils/secret';
import { createToken, verifyToken } from '../../utils/jwt';
import { join, resolve } from 'path';
import { createWriteStream } from 'fs';
import { uuid } from '../../utils/uuid'
import { Random } from '../../utils/rand'
import { existDir } from '../../utils/file'
import useGlobal from '../../utils/global'
const nodemailer = require('nodemailer')
@Injectable()
export class UserService {
    constructor(
        @Inject(UserRepository) private readonly userRepository: UserRepository,
    ) { }
    statisticsFans(userId: number) {
        return getJSONResult(async (res) => {
            const resultMap = await this.userRepository.countFollow(userId)
            res.data = resultMap[0].result
        })
    }
    async statisticsAllCount(userId: number) {        
        const data = {}
        try {
            const result1 = await this.userRepository.countFollowUser(userId)
            const result2 = await this.userRepository.countFollow(userId)
            const result3 = await this.userRepository.countArticles(userId)
            const result4 = await this.userRepository.countAction(userId)                        
            data['follow'] = result1[0].result? result1[0].result.split(',').length : 0                       
            data['fans'] = result2[0].result
            data['articles'] = result3[0].result            
            const action = result4.length? {likes: Number(result4[0]['likes']), loves: Number(result4[0]['loves']), collects: Number(result4[0]['collects'])} : {likes: 0, loves: 0, collects: 0}            
            Object.assign(data, action)            
            return JSONResult(200, data, 'ok')
        } catch (err) {
            return JSONResult(500, null, err)
        }        
    }
    queryAllUser() {    
        return getJSONResult(async (res) => {            
            res.data = await this.userRepository.findAll()                                  
        })             
    }
    queryOne(userName: string, userPwd: string) {       
        return getJSONResult(async (res) => {
            const resultMap = await this.userRepository.findOne(userName, AES_ECB_ENCRYPT(userPwd))            
            res.data = resultMap[0].result          
        })        
    }
    queryOneById(id: number) {
        return getJSONResult(async (res) => {
            const list = await this.userRepository.findOneById(id)
            res.data = list.length? list[0] : {}
        })
    }
    queryOneDetail(token: string) {
        const { decoded, err } = verifyToken(token)                
        if(err) {
            return JSONResult(401, null, 'token???????????????!')
        } else {                        
            return getJSONResult(async (res) => {                
                res.data = await this.userRepository.findOneDetail(decoded.userName, AES_ECB_ENCRYPT(decoded.userPwd))                                                   
            })
        }        
    }
    queryUserByIds(userIds: string) {
        return getJSONResult(async (res) => {
            res.data = await this.userRepository.findFollowByIds(userIds)
        })
    }
    queryAuthorCountById(userId: number) {
        return getJSONResult(async (res) => {
            const results = await this.userRepository.countAuthorCount(userId)
            results.length > 0? res.data = results[0] : res.data = {articles: 0, follows: 0, likes: 0}
        })
    }
    async queryRecommendAuthor() {    
        const url = join(__dirname, '../','../public/upload', `111.png`);                                            
        return getJSONResult(async (res) => {
            res.data = await this.userRepository.recommendAuthor()
        })
    }
    async queryUserAndArticle() {
        try {
            const authors = await this.userRepository.recommendAuthor()
            const userIds = authors.map(i => i.userId)
            const articles = await this.userRepository.queryArticleByUsers(userIds)            
            const results = authors.map(i => {
                const concatArticles = articles.filter(a => {
                    return a.userId === i.userId
                })                
                return  {
                            "userId": i.userId,
                            "userName": i.userName,
                            "userPwd": i.userPwd,
                            "roleId": i.roleId,
                            "userNickName": i.userNickName,
                            "userPhone": i.userPhone,
                            "userEmail": i.userEmail,
                            "userAvatar": i.userAvatar,
                            "userOrgnName": i.userOrgnName,
                            "userAddress": i.userAddress,
                            "userPosition": i.userPosition,
                            "userMajor": i.userMajor,
                            "userIntroduct": i.userIntroduct,
                            "userLoginTime": i.userLoginTime,
                            "createTime": i.createTime,
                            "updateTime": i.updateTime,
                            "userRelate": i.userRelate,
                            "concatArticles": concatArticles
                        } 
                                       
                })
            return JSONResult(200, results, "ok")
            
        } catch (err) {
            return JSONResult(500, null, err)
        }
    }
    addOne(user: any) {
        return getJSONResult(async (res) => {
            const [results, metadata] = await this.userRepository.insertOne(user)
            res.data = metadata
        })        
    }
    setOne(user: any) {
        return getJSONResult(async (res) => {
            const [results, metadata] = await this.userRepository.updateOne(user)
            res.data = metadata
        })        
    }
    setOneIds(ids: string, id: number) {
        return getJSONResult(async (res) => {
            const [results, metadata] = await this.userRepository.concatOne(ids, id)
            res.data = metadata
        })
    }
    setOneRelate(userId: number, userRelate: string) {
        return getJSONResult(async (res) => {
            const [results, metadata] = await this.userRepository.updateRelate(userId, userRelate)
            res.data = metadata
        })
    }
    async register(user: any) {
        const {userName, userPwd} = user
        try {
            const resultMap = await this.userRepository.findOne(userName, AES_ECB_ENCRYPT(userPwd))
            if (resultMap[0].result) {                                
                return JSONResult(501, null, '??????????????????????????????!')
            } else {
                user = {...user, userPwd: AES_ECB_ENCRYPT(user.userPwd)}
                const [results, metadata] = await this.userRepository.insertOne(user)
                if (metadata) {
                    return JSONResult(200, createToken({userName: user.userName, userPwd: AES_ECB_DECRYPT(user.userPwd)}, 60 * 60), 'ok')
                } else {
                    return JSONResult(500, null, `????????????, ?????????!`)
                }                
            }        
        } catch(err) {            
            return JSONResult(505, null, `register????????????:${err}`)
        }                 
    }
    async login(userName: string, userPwd: string) {
        try {
            const resultMap = await this.userRepository.findOne(userName, AES_ECB_ENCRYPT(userPwd))
            if (resultMap[0].result) {
                return JSONResult(200, createToken({userName, userPwd}, 60 * 60), 'ok')
            } else {
                return JSONResult(500, null, '?????????????????????????????????!')
            }
        } catch (err) {
            return JSONResult(500, null, `login: ${err}`)
        }
    }
    async uploadPicture(file: any, userId: number) {                        
        const fileUUName = uuid()
        const fileType = file.originalname.split('.')[1]
        await existDir(join(__dirname, '..','../public/upload'))
        const writeImage = createWriteStream(join(__dirname, '..','../public/upload', `${fileUUName}.${fileType}`))                        
        writeImage.write(file.buffer)
        try {
            const [results, metadata] = await this.userRepository.updateAvatar(userId, `/user/picture/${fileUUName}.${fileType}`)
            if (metadata) {
                return getJSONResult(async (res) => {
                    const resultList = await this.userRepository.findOneById(userId)
                    resultList.length > 0? res.data = resultList[0] : res.data = null
                })
            } else {
                return JSONResult(500, null, '????????????????????????!')    
            }      
        } catch (err) {
            return JSONResult(500, null, err)
        }                
    }
    sendMail(userId: number, targetEmail: string) {        
        const global = useGlobal
        const serverEmail = 'wy17375179032@163.com'
        const authCode = 'BYRTPTVDVCWNPNTT'
        const subject = '??????????????????'        
        const content = '??????????????????'
        const code = Random(100000, 1000000)
        const transporter = nodemailer.createTransport({
            service: "163", // 163|qq
            secure: true,
            auth: {
                user: serverEmail,
                pass: authCode
            }
        })
        const mailOptions = {
            from: serverEmail,
            to: targetEmail,
            subject: subject,
            text: content,
            html: `
                <div style="padding: 20px; box-sizing:border-box; width: 100%; height: 250px; background-color: #f5f5f5; overflow: hidden;">
                    <div style="padding:15px; box-sizing:border-box; width:100%; height: 100%;border-radius: 10px; background-color: #fff;">
                        <h4>????????????</h4>
                        <div style="margin-top: 15px;display:flex;flex-direction: row">
                            <div style="flex-grow:1; color: #999;">?????????</div>
                            <div style="width: 60%; color: #333;font-size: 18px">${code}</div>
                        </div>
                        <div style="display:flex;flex-direction: row">
                            <div style="flex-grow:1; color: #999;">????????????</div>
                            <div style="width: 60%; color: #333; font-size: 18px">??????????????????????????????????????????: ${code}</div>
                        </div>
                    </div>
                    
                </div>
            `
        };        
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
              console.log(err);                        
            } else {              
              global.setState([...global.getState(), {code, email: targetEmail, userId, time: new Date().getTime()}]);
              console.log("??????????????????");            
            }
        });        
    }
    async verEmail(code: string, timeStamp: number) {
        const emailList = useGlobal.getState()
        const target = emailList.find(i => {
            return i.code == Number(code)
        })
        if (target) {
            let result = null
            if(Number(timeStamp) - target.time < 1000 * 60) {
                await this.userRepository.updateEmail(target.userId, target.email)
                const results = await this.userRepository.findOneById(target.userId)                
                if (results.length) {
                    result = JSONResult(200, results[0], '????????????!')
                } else {
                    result = JSONResult(500, null, '????????????????????????!')
                }                
            } else {
                result = JSONResult(500, null, '????????????,??????????????????!')
            }            
            return result
        } else {
            return JSONResult(500, null, '????????????,????????????????????????!')
        }                
    }
    async resetPwd(code: string, timeStamp: number, userPwd: string) {
        const emailList = useGlobal.getState()
        const target = emailList.find(i => {
            return i.code == Number(code)
        })
        console.log('emailList', emailList)
        if (target) {
            let result = null
            if(Number(timeStamp) - target.time < 1000 * 60) {
                await this.userRepository.updatePwd(target.userId, AES_ECB_ENCRYPT(userPwd))
                const results = await this.userRepository.findOneById(target.userId)
                if (results.length) {
                    // ?????????????????????????????????token
                    const token = createToken({userName: results[0].userName, userPwd}, 60 * 60) 
                    result = JSONResult(200, {user: results[0], token}, '????????????!')
                } else {
                    result = JSONResult(500, null, '??????????????????!')
                }                
            } else {
                result = JSONResult(500, null, '????????????,??????????????????!')
            }            
            return result
        } else {
            return JSONResult(500, null, '????????????,????????????????????????!')
        }
    }
}
