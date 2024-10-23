export const createOnlineBoard = ()=>{
    const onlineBoard = document.createElement('div')
    onlineBoard.classList.add('onlineBoard')
    const onlineHeader = document.createElement('h3')
    const onlineList = document.createElement('ul')
    onlineHeader.innerText = "Online"
    onlineBoard.appendChild(onlineHeader)
    onlineBoard.appendChild(onlineList)
    
    document.body.appendChild(onlineBoard)

}

