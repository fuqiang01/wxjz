export default {
    baseUrl: "https://wxjz.fqiang.co",
    // baseUrl: "http://localhost:19525",
    onLogin: "/user/onLogin", // 登录
    updateNameAndPhoto: "/user/updateNameAndPhoto", // 更新用户的名字和头像地址
    addWrongTopic: "/user/addWrongTopic", // 上传错题的id或者id数组(数组用 ; 来分割)
    addRightTopic: "/user/addRightTopic", // 上传对题的id或者id数组
    getRightWrongNotDoneTopicNumber: "/user/getRightWrongNotDoneTopicNumber", // 获得对题、错题、未做题的数量
    getWrongTopic: "/user/getWrongTopic", // 获得做错的题目集合
    getNotDoneTopic: "/user/getNotDoneTopic", // 获得未做的题目集合，如果穿了isSome为true的话就只返回查到的前五题
    getAllResult: "/user/getAllResult", // 返回该用户的所有考试成绩
    getBestResult: "/user/getBestResult", // 返回该用户的最好考试成绩 
    getMessagesByUser: "/user/getMessages", // 返回改用户的所有留言
    updateCollectionTopic: "/user/updateCollectionTopic", // 添加收藏，或取消收藏
    getCollectionTopic: "/user/getCollectionTopic", // 返回收藏的题目
    getCollectionTopicIds: "/user/getCollectionTopicIds", // 返回收藏的题目的id数组
    getRandomTopic: "/user/getRandomTopic", // 返回随机练习的题目
    resetUserTopic: "/user/resetUserTopic", // 重置用户题目
    getSuperUserMessages: "/user/getSuperUserMessages", // 分页返回超级用户的留言
    getTestTopic: "/topic/getTestTopic", // 返回某一科目的测试题
    getTopicTypeNumber: "/topic/getTopicTypeNumber", // 返回题目各类型的数量
    getTextOrImageTopic: "/topic/getTextOrImageTopic", // 返回文字题或者图片题
    getTestTypeTopic: "/topic/getTestTypeTopic", // 返回单选题或者判断题或者判断题的题目
    getKnowledgeTypeTopic: "/topic/getKnowledgeTypeTopic", //返回只是各个知识类型的题目
    getRightOrWrongTopic: "/topic/getRightOrWrongTopic", // 返回正确题或错误题
    getChapterTypeTopicNumber: "/topic/getChapterTypeTopicNumber", // 返回各章节的题目数量
    getChapterTypeTopoics: "/topic/getChapterTypeTopoics", // 返回某个章节的题目
    addResult: "/result/add", // 添加一条成绩
    getRankingList: "/result/getRankingList", // 获取某一科目的成绩排行前一百名
    addMessage: "/message/add", // 添加一条留言
    replyMessage: "/message/reply", // 回复留言，当然只有超级用户可以回复
    deleteMessage: "/message/delete", // 删除留言
    getAllMessage: "/message/getAll", // 返回所有留言
    getMessageByPage: "/message/getMessageByPage", // 分页获得留言
    getNotReadMessage: "/message/getNotRead", // 获得未读的留言
    markRead: "/message/markRead", // 将某条未读留言标记为已读
    addFileToCos: "/message/addFileToCos", // 上传文件到cos上
    getMarkTypeNumber: "/mark/getTypeNumber", // 返回各类型标志的数量
    getMarkByType: "/mark/getMarkByType", // 返回某一类型的标志数据
    getSignsTypeList: "/mark/getSignsTypeList", // 返回交通标志页面的各种标志的数据集合
}