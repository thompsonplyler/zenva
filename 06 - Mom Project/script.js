window.addEventListener('DOMContentLoaded', (event) => {
    let cleanerBody = document.getElementById("cleaner")
    let processBtn = document.getElementById("process-btn")
    let textArea = document.getElementById("textarea")
    let newHtml = document.createElement('div')
    let form = document.getElementById("form")


    let p = Array.from(document.getElementsByTagName("p"))
    let img = Array.from(document.getElementsByTagName("img"))
    let em = Array.from(document.getElementsByTagName("em"))
    let h4 = Array.from(document.getElementsByTagName("h4"))
    let h3 = Array.from(document.getElementsByTagName("h3"))
    let i = Array.from(document.getElementsByTagName("i"))
    let strong = Array.from(document.getElementsByTagName("strong"))
    let span = Array.from(document.getElementsByTagName("span"))
    let font = Array.from(document.getElementsByTagName("font"))
    let a = Array.from(document.getElementsByTagName("a"))
    let body = document.getElementsByTagName("body")

    let pageContents = [p,h3,h4,em,i,a,img,strong,span]
    let pageContentsNoSpan = [p,h3,h4,em,i, img, strong]

    form.addEventListener('submit', e=>submitHandler(e))

    // removeStyles(pageContents)
    // fontKiller(font)
    // spanKiller(body)
    // fontReKiller(body)

    
    // console.log(document.getElementsByTagName("body")[0].innerHTML)
});

let submitHandler= (e) => {
    e.preventDefault()
    let div = document.createElement("div")
    let articleBody = e.target.elements[0].value
    div.innerHTML = articleBody
    console.log(div)
}


spanKiller = function(data){
    // console.log(data[0])
    let bodyContents = data[0]
    let cleanedBody = bodyContents.innerHTML.replace(/<span>/g,"").replace(/<\/span>/g,"").replace(/&nbsp;/g," ").replace(/&quot;/g,"'").replace(/<strong><img/g,"<img").replace(/><\/strong>/g,">").replace(/<em><img/g,"<img").replace(/><\/em>/g,">")
    data[0].innerHTML = cleanedBody
}

fontReKiller = function(data){
    let bodyContents = data[0]
    let cleanedBody = bodyContents.innerHTML.replace(/<font color="#000000">/,"").replace(/<\/font>"/,"")
    data[0].innerHTML = cleanedBody

}

// let imageFormatRemover = (data) => {
    
//     data.forEach(img=> {
//         //looking at each image in the page
//         if (img.parentNode) {
//             // want to see the entire HTML and break it into parts, so
//             // see what the useful node is that carries formatting with it,
//             // such as <h3> or <p>. 
//             // we will remove all instances of <span> and </span> from this array.  
        

//             if (img.parentNode.parentNode) {
//                 let usefulNodeHTML = img.parentNode.parentNode.innerHTML
//                 let usefulNode = img.parentNode.parentNode
//                 let formattedText = usefulNode.innerHTML.replace(/<strong><img /g, "<img ").replace(/><\/strong>/g,"/>").replace(/<em><img /g, "<img ").replace(/><\/em>/g,"/>")
//                 usefulNode.innerHTML = formattedText


                
//                 // console.log(usefulNodeHTML.split(" "))
//                 // usefulNodeHTML.forEach((el,i) => {
//                 //     let item
//                 // })
//             }
//         }

//     })
// }

let fontKiller = (data) =>{
    data.forEach(font => {
        let text = font.innerHTML
        let pNode 
        if (font.parentNode){
            pNode = font.parentNode
            pNode.innerHTML = text
        }
        font.remove()    
    })
}

let removeStyles = (data) => {
    if (data.length>0) {data.forEach(element => {
        element.forEach(e=> {
            if (e.tagName!=="IMG"){
                e.removeAttribute('class')
                e.removeAttribute('style')
            }
            else{
                e.removeAttribute('class')
            }
            })
    })}
}

let fixCodeSwitch = (data) => {
    data.forEach(datum=> {
        let wrongSpace = datum.filter(paragraph => paragraph.innerHTML.includes("&nbsp;"))
        let wrongQuot = datum.filter(paragraph => paragraph.innerHTML.includes("&quot;"))

        examineWrongQuot(wrongQuot)
        examineWrongSpace(wrongSpace)
    })

}

let examineWrongSpace = (wrongSpace) => {
    return wrongSpace.forEach(p => p.innerHTML = p.innerHTML.replace("&nbsp;"," "))
}

let examineWrongQuot = (wrongQuot) => {
    wrongQuot.forEach(p => p.innerHTML = p.innerHTML.replace("&quot;","\""))
}