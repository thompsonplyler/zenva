window.addEventListener('DOMContentLoaded', (event) => {
    let p = Array.from(document.getElementsByTagName("p"))
    let img = Array.from(document.getElementsByTagName("img"))
    let em = Array.from(document.getElementsByTagName("em"))
    let h4 = Array.from(document.getElementsByTagName("h4"))
    let h3 = Array.from(document.getElementsByTagName("h3"))
    let i = Array.from(document.getElementsByTagName("i"))
    let strong = Array.from(document.getElementsByTagName("strong"))
    let span = Array.from(document.getElementsByTagName("span"))
    let font = Array.from(document.getElementsByTagName("font"))

    let pageContents = [p,h3,h4,em,i,img,strong,span]
    let pageContentsNoSpan = [p,h3,h4,em,i, img, strong]
    removeStyles(pageContents)
    fixCodeSwitch(pageContents)
    fontKiller(font)
    imageFormatRemover(img)
    pageContentsNoSpan.forEach(array=> pExaminer(array)) 
});

let imageFormatRemover = (data) => {
    
    data.forEach(img=> {
        //looking at each image in the page
        if (img.parentNode) {
            // want to see the entire HTML and break it into parts, so
            // see what the useful node is that carries formatting with it,
            // such as <h3> or <p>. 
            // we will remove all instances of <span> and </span> from this array.  

            if (img.parentNode.parentNode) {
                let usefulNodeHTML = img.parentNode.parentNode.innerHTML
                console.log(usefulNodeHTML.split(" "))
                usefulNodeHTML.forEach((el,i) => {
                    let item
                    if el
                })
            }
        }

    })
}

        
//     {if (img.parentNode){
//         if (img.parentNode.tagName == "STRONG" ||img.parentNode.tagName == "EM"){
//             if (img.parentNode.parentNode){
//                 let actualImage = img
//                 let dumbNode = img.parentNode
//                 let rightNode = img.parentNode.parentNode

//                 rightNode.innerHTML.split(" ").forEach((value,i) =>{
//                     if (value.indexOf('<strong>') > -1) {
//                         console.log(i)
//                 }
//                     else if (value.indexOf('</strong>')>-1){
//                 console.log(value)
//                 }   
//             })
//                         }
//                     }

//                 }
//         }
//     )
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

let pExaminer = (data) => {
    // this receives an array containing every paragraph element found on the page. 
    // data = big array

    // 
    data.forEach(p=> {
        // console.log(p.innerText)
        // p.innerHTML = p.innerText
        // console.log(p.innerHTML)
        pArray = []
        if (p.childNodes){
            pArray = Array.from(p.childNodes)
        }
        // console.log(pArray)
        
        // let pArray = Array.from(p.childNodes)
        // console.log(pArray)
        // pArray.forEach((child,index)=> {
        //     console.log("Child for index "+index+":"+ child.textContent)
        // })
        
        // .forEach(node=>{
        //     if (node.tagName == "SPAN"){
        //         console.log(node.textContent)
        //     }
        // })

    })

}

let examineParagraphContents = (p) => {
    let haveImages = p.filter(paragraph => paragraph.getElementsByTagName('img').length > 0)
    let haveSpans = p.filter(paragraph => paragraph.getElementsByTagName('span').length > 0)
    let wrongSpace = p.filter(paragraph => paragraph.innerHTML.includes("&nbsp;"))
    let wrongQuot = p.filter(paragraph => paragraph.innerHTML.includes("&quot;"))

    examineWrongQuot(wrongQuot)
    
    examinePWithImages(haveImages)
    examinePWithSpans(haveSpans)
    removeStylesFrom(p)
    // examinePWithSpans(haveSpans)
}

let examinePWithImages = (haveImages) => {

    // find instances where an image has font styles
    // returns an array for all verified instances
    let boldStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<strong><img"))
    let italicStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<em><img"))
    let underLineStyleImages = haveImages.filter(paragraph => paragraph.innerHTML.includes("<u><img"))

    //removes the 
    boldStyleImages.forEach(p => p.innerHTML = p.innerHTML.replace("<strong><img","<img").replace("</strong>",""))
    italicStyleImages.forEach(p => {p.innerHTML = p.innerHTML.replace("<em>","").replace("</em>","")})    
    underLineStyleImages.forEach(p => p.innerHTML = p.innerHTML.replace("<u>","").replace("</u>",""))
}


let examinePWithSpans = (haveSpans) => {
    // console.log("These have spans:", haveSpans)
    // console.log("This is how many paragraphs contain span elements:", haveSpans.length)
    // return haveSpans.forEach(p => p.children.forEach(child=> {
    //     console.log(child) 
    // }))
    haveSpans.forEach(p=> {
        let spanArray = Array.from(p.children)
        spanArray.forEach(child => {
            if(child.tagName == "SPAN"){
                let spanText = child.innerText
                let pNode = child.parentNode
                if (pNode){
                    child.remove()
                    pNode.innerText = spanText
                }
                // child.remove()
                // pNode.innerText = spanText
                
            }
           })
    })

}


// does a paragraph have an image? 


// 
