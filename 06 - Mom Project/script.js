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

    // if a p tag contains no content besides an img tag, remove everything but the img tag.
    // if a p, h3, or h4 tag contains a bunch of styling, remove it. 
    // styling that follows an img tag can stay.
    // all span tags can go

    let pageContents = [p,h3,h4,em,i,img,strong,span]
    removeStyles(pageContents)
    fixCodeSwitch(pageContents)
    fontKiller(font)
    // dumbTagKiller(font)
    // dumbTagKiller(span)
});

let fontKiller = (data) =>{
    data.forEach(font => {
        console.log(font)
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

let dumbTagKiller=(data) =>{
    data.forEach(datum=>{
        if (datum.tagName=="SPAN"){
            console.log(datum.innerHTML.length)
        }})

    data.forEach(datum=>{
        let text = datum.innerHTML
        let pNode = datum.parentNode
        datum.remove()
        pNode.append(text)
        if (pNode.tagName == "SPAN"){
            let theRealpNode  = pNode.parentNode
            pNode.remove()
            theRealpNode.append(text)

        }
    })
    // span.forEach(span=> {
    //     let text = span.innerHTML
    //     let pNode = span.parentNode
    //     pNode.removeAttribute("style")
    //     if (span.innerText.length > 2) {
    //         span.remove();
    //         pNode.append(text)
    //     }
    //     else {
    //         span.remove()
    //     }
        
    // })
    // span.forEach(span=>console.log(span.parentNode))
}

let fixCodeSwitch = (data) => {
    data.forEach(datum=> {
        let wrongSpace = datum.filter(paragraph => paragraph.innerHTML.includes("&nbsp;"))
        let wrongQuot = datum.filter(paragraph => paragraph.innerHTML.includes("&quot;"))

        examineWrongQuot(wrongQuot)
        examineWrongSpace(wrongSpace)
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

let removeStylesFrom = (p) => {
    p.forEach(paragraph =>{
        paragraph.removeAttribute('style')
        paragraph.removeAttribute('class')
    })
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

let examineWrongSpace = (wrongSpace) => {
    return wrongSpace.forEach(p => p.innerHTML = p.innerHTML.replace("&nbsp;"," "))
}

let examineWrongQuot = (wrongQuot) => {
    wrongQuot.forEach(p => p.innerHTML = p.innerHTML.replace("&quot;","\""))
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
