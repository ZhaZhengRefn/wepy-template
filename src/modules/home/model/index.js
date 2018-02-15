export function addProgressClass(progress, typeToTag) {
  return progress.map((item, index) => {
    item.tag = typeToTag[item.type]
    return item
  })
}

export function addUiState(records, typeToTag, typeToText){
    function minsToLength(mins){
        mins = +mins
        if(mins <= 35){
            return 'min'
        } else if(mins > 100){
            return 'max'
        }
        return 'medium'
    }
    return records.map(item => {
        item.tagClass = typeToTag[item.type]
        item.tagText = typeToText[item.type]
        item.lengthClass = minsToLength(item.time)
        return item
    })
}

export function limitRatio(timeRatio){
    const num = +timeRatio.split('%')[0]
    if(num > 100){
        return 100 + '%'
    }
    return timeRatio
}