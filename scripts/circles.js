
window.onload = initCircles;

function initCircles() {
    var i = 1
    var mainStyle = getComputedStyle(document.querySelector('main'))
    while (true) {
        var circle = document.querySelector('.circle:nth-of-type(' + i++ + ')')
        if (circle == null) {
            break
        }
        animateCircle(circle, mainStyle)
    }
}

function animateCircle(circle, mainStyle) {
    var duration = Math.random() * 10 * 1000
    setTimeout(function () {
        var top = getRandomTop(circle, mainStyle)
        var left = getRandomLeft(circle, mainStyle)
        placeCircle(circle, top, left)
        animateCircle(circle, mainStyle);
    }, duration);
}

function getRandomTop(circle, mainStyle) {
    var circleStyle = getComputedStyle(circle)
    var height = getPart(circleStyle.height, mainStyle.height) * 100
    var maxTop = 100 - height;
    return Math.random() * maxTop
}

function getRandomLeft(circle, mainStyle) {
    var circleStyle = getComputedStyle(circle)
    var width = getPart(circleStyle.width, mainStyle.width) * 100
    var maxLeft = 100 - width;
    return Math.random() * maxLeft
}

function getPart(counter, denominator) {
    return toFloat(counter) / toFloat(denominator)
}

function toFloat(string) {
    var f = string.replace('px', '')
    return f
}

function placeCircle(circle, top, left) {
    circle.style.setProperty('top', top + 'vh')
    circle.style.setProperty('left', left + 'vw')
}