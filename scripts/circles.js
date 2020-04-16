
window.onload = initCircles;

function initCircles() {
    var i = 1
    var main = document.querySelector('main')
    while (true) {
        var circle = document.querySelector('.circle:nth-of-type(' + i++ + ')')
        if (circle == null) {
            break
        }
        initCircle(main, circle)
    }
}

function initCircle(main, circle) {
    var mainStyle = getComputedStyle(main)
    var circleStyle = getComputedStyle(circle)

    var height = getPart(circleStyle.height, mainStyle.height) * 100
    var maxTop = 100 - height;
    var top = Math.random() * maxTop
    circle.style.setProperty('top', top + 'vh')

    var width = getPart(circleStyle.width, mainStyle.width) * 100
    var maxLeft = 100 - width
    var left = Math.random() * maxLeft
    circle.style.setProperty('left', left + 'vw')

    console.log('top:' + top + ' , left:' + left)
    return true
}

function getPart(counter, denominator) {
    return toFloat(counter) / toFloat(denominator)
}

function toFloat(string) {
    var f = string.replace('px', '')
    return f
}