import urls from "./urls";
// 自定义一个返回Promise对象的请求方法
const myRequest = config => {
    return new Promise((resolve, reject) => {
        wx.request({
            ...config,
            url: urls.baseUrl + config.url,
            success(res) {
                resolve(res);
            },
            fail(err) {
                reject(err);
            }
        })
    })
}

// 登录
export function onLogin(code) {
    return myRequest({
        url: urls.onLogin,
        method: "POST",
        data: {
            code
        }
    })
}

// 更新用户名字和头像
export function updateNameAndPhoto(userId, name, photoUrl) {
    return myRequest({
        url: urls.updateNameAndPhoto,
        method: "POST",
        data: {
            userId,
            name,
            photoUrl
        }
    })
}

// 上传错题id
export function addWrongTopic(subject, userId, topicIds) {
    return myRequest({
        url: urls.addWrongTopic,
        method: "POST",
        data: {
            subject,
            userId,
            topicIds
        }
    })
}

// 上传对题id
export function addRightTopic(subject, userId, topicIds) {
    return myRequest({
        url: urls.addRightTopic,
        method: "POST",
        data: {
            subject,
            userId,
            topicIds
        }
    })
}

// 获得对题、错题、未做题的数量
export function getRightWrongNotDoneTopicNumber(subject, userId) {
    return myRequest({
        url: urls.getRightWrongNotDoneTopicNumber,
        data: {
            subject,
            userId
        }
    })
}

// 获取做错的题目
export function getWrongTopic(subject, userId) {
    return myRequest({
        url: urls.getWrongTopic,
        data: {
            subject,
            userId
        }
    })
}

// 获取没做过的题目，isSome为0代表获取所有，为1代表获取前几个进行懒加载
export function getNotDoneTopic(subject, userId, isSome = false) {
    // 将布尔值转换成1或0，方便后端处理
    isSome = isSome ? 1 : 0;
    return myRequest({
        url: urls.getNotDoneTopic,
        data: {
            subject,
            userId,
            isSome
        }
    })
}

// 获取所有成绩
export function getAllResult(subject, userId) {
    return myRequest({
        url: urls.getAllResult,
        data: {
            subject,
            userId
        }
    })
}

// 获取最好的成绩
export function getBestResult(subject, userId) {
    return myRequest({
        url: urls.getBestResult,
        data: {
            subject,
            userId
        }
    })
}

// 获取该用户的所有留言
export function getMessagesByUser(userId) {
    return myRequest({
        url: urls.getMessagesByUser,
        data: {
            userId
        }
    })
}

// 获取模拟考试的题目
export function getTestTopic(subject) {
    return myRequest({
        url: urls.getTestTopic,
        data: {
            subject
        }
    })
}

// 上传一条成绩
export function addResult(subject, userId, score, timeConsuming) {
    return myRequest({
        url: urls.addResult,
        method: "POST",
        data: {
            subject,
            userId,
            score,
            timeConsuming
        }
    })
}

// 获取排行榜数据
export function getRankingList(subject, userId) {
    return myRequest({
        url: urls.getRankingList,
        data: {
            subject,
            userId
        }
    })
}

// 上传一条留言
export function addMessage(userId, imgUrls, content) {
    return myRequest({
        url: urls.addMessage,
        method: "POST",
        data: {
            userId,
            imgUrls,
            content
        }
    })
}

// 超级用户回复留言
export function replyMessage(userId, text, messageId) {
    return myRequest({
        url: urls.replyMessage,
        method: "POST",
        data: {
            userId,
            text,
            messageId
        }
    })
}

// 超级用户删除留言
export function deleteMessage(userId, messageId) {
    return myRequest({
        url: urls.deleteMessage,
        method: "POST",
        data: {
            userId,
            messageId
        }
    })
}

// 获取所有留言
export function getAllMessage() {
    return myRequest({
        url: urls.getAllMessage
    })
}

// 分页获取留言
export function getMessageByPage(pageNumber, pageCapacity) {
    return myRequest({
        url: urls.getMessageByPage,
        data: {
            pageNumber,
            pageCapacity
        }
    })
}

// 分页获取超级用户留言
export function getSuperUserMessages(pageNumber, pageCapacity){
    return myRequest({
        url: urls.getSuperUserMessages,
        data: {
            pageNumber,
            pageCapacity
        }
    })
}

// 获得未读的留言
export function getNotReadMessage() {
    return myRequest({
        url: urls.getNotReadMessage
    })
}

// 上传文件到cos上，上传文件的key为 file
export function addFileToCos(fromData) {
    return myRequest({
        url: urls.addFileToCos,
        method: "POST",
        data: fromData
    })
}

// 添加收藏或者删除收藏
export function updateCollectionTopic(subject, userId, topicId) {
    return myRequest({
        url: urls.updateCollectionTopic,
        method: "POST",
        data: {
            subject,
            userId,
            topicId
        }
    })
}

// 获取收藏的题目
export function getCollectionTopic(subject, userId){
    return myRequest({
        url: urls.getCollectionTopic,
        data: {
            subject,
            userId
        }
    })
}

// 获取收藏题目的id数组
export function getCollectionTopicIds(subject, userId){
    return myRequest({
        url: urls.getCollectionTopicIds,
        data: {
            subject,
            userId
        }
    })
}

// 获取随机练习的题目
export function getRandomTopic(subject, userId){
    return myRequest({
        url: urls.getRandomTopic,
        data: {
            subject,
            userId
        }
    })
}

// 重置用户题目
export function resetUserTopic(subject, userId){
    return myRequest({
        url: urls.resetUserTopic,
        method: "POST",
        data: {
            subject,
            userId
        }
    })
}

// 获取题目各类型的数量
export function getTopicTypeNumber(subject){
    return myRequest({
        url: urls.getTopicTypeNumber,
        data: {
            subject
        }
    })
}

// 返回文字题或者图片题
export function getTextOrImageTopic(subject, type){
    return myRequest({
        url: urls.getTextOrImageTopic,
        data: {
            subject,
            type
        }
    })
}

// 返回单选题或者判断题或者判断题的题目
export function getTestTypeTopic(subject, type){
    return myRequest({
        url: urls.getTestTypeTopic,
        data: {
            subject,
            type
        }
    })
}

 //返回只是各个知识类型的题目
export function getKnowledgeTypeTopic(subject, type){
    return myRequest({
        url: urls.getKnowledgeTypeTopic,
        data: {
            subject,
            type
        }
    })
}

// 返回正确题或错误题
export function getRightOrWrongTopic(subject, type){
    return myRequest({
        url: urls.getRightOrWrongTopic,
        data: {
            subject,
            type
        }
    })
}

// 返回每个章节的题目数量
export function getChapterTypeTopicNumber(subject){
    return myRequest({
        url: urls.getChapterTypeTopicNumber,
        data: {
            subject
        }
    })
}


// 返回某一章节的题目
export function getChapterTypeTopoics(subject, type){
    return myRequest({
        url: urls.getChapterTypeTopoics,
        data: {
            subject,
            type
        }
    })
}

// 返回各类型标志的数量
export function getMarkTypeNumber(){
    return myRequest({
        url: urls.getMarkTypeNumber,
    })
}

// 返回某一类型的标志数据
export function getMarkByType(type, signsType, pageNumber, pageCapacity){
    return myRequest({
        url: urls.getMarkByType,
        data: {
            type, 
            pageNumber, 
            pageCapacity,
            signsType
        }
    })
}

// 返回交通标志页面的各种标志的数据集合
export function getSignsTypeList(){
    return myRequest({
        url: urls.getSignsTypeList
    })
}

// 将某条未读留言标记为已读
export function markRead(messageId){
    return myRequest({
        url: urls.markRead,
        method: "POST",
        data: {
            messageId
        }
    })
}