
export default function request(option){
    let { beforeSend } = option
    if(!wx.request || typeof wx.request !== 'function'){
        throw new Error('wx.request does not exist!')
    }
    if(typeof beforeSend === 'function'){
        const result = beforeSend(option)
        .then(res => {
            wx.request(option)
        })
        .catch(e => {
            console.warn(e)
        })
    } else {
        wx.request(option)
    }
}