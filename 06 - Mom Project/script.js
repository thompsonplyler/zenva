window.addEventListener('DOMContentLoaded', (event) => {
    let p = Array.from(document.getElementsByTagName("p"))
    let img = Array.from(document.getElementsByTagName("img"))
    
    // if a p tag contains no content besides an img tag, remove everything but the img tag.
    // if a p, h3, or h4 tag contains a bunch of styling, remove it. 
    // styling that follows an img tag can stay.
    // all span tags can go

    examineParagraphContents(p)
    cleanImages(img)
});

let cleanImages = (img) => {
    img.forEach(img => img.classList.remove("img-responsive"))
    console.log(img)
}

let examineParagraphContents = (p) => {
    let haveImages = p.filter(paragraph => paragraph.getElementsByTagName('img').length > 0)
    let haveSpans = p.filter(paragraph => paragraph.getElementsByTagName('span').length > 0)
    let wrongSpace = p.filter(paragraph => paragraph.innerHTML.includes("&nbsp;"))
    let wrongQuot = p.filter(paragraph => paragraph.innerHTML.includes("&quot;"))

    examineWrongQuot(wrongQuot)
    examineWrongSpace(wrongSpace)
    examinePWithImages(haveImages)
    examinePWithSpans(haveSpans)
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

let examineWrongSpace = (wrongSpace) => {
    return wrongSpace.forEach(p => p.innerHTML = p.innerHTML.replace("&nbsp;"," "))
}

let examineWrongQuot = (wrongQuot) => {
    wrongQuot.forEach(p => p.innerHTML = p.innerHTML.replace("&quot;","\""))
}

let examinePWithSpans = (haveSpans) => {
    console.log("These have spans:", haveSpans)
    console.log(haveSpans.length)
    return haveSpans.forEach(p => console.log("P before work:",p.innerHTML.replace("<span ","").replace("</span>)","")) )


      



}


// does a paragraph have an image? 


// 
