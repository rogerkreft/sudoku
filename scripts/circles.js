
window.onload = init

var mainStyle

function init() {
    var main = document.querySelector('main')
    mainStyle = getComputedStyle(main)
    initCircles()
}

function initCircles() {
    var i = 1
    while (true) {
        var circle = document.querySelector('.circle:nth-of-type(' + i++ + ')')
        if (circle == null) {
            break
        }
        circle.setAttribute('number', i)
        var circleStyle = circle.style
        circleStyle.setProperty('animation-name', getAnimationName(circle))
        circleStyle.setProperty('animation-timing-function', 'linear')
        circleStyle.setProperty('animation-iteration-count', 'infinite')
        animateCircle(circle)
    }
}

function animateCircle(circle) {
    placeCircle(circle)
    var animationStyle = getAnimationStyle(circle)
    animationStyle.data = getKeyframes(circle)
    var duration = Math.random() * 60 * 1000
    circle.style.setProperty('animation-duration', duration + 'ms')
    setTimeout(function () {
        animateCircle(circle)
    }, duration);
}

function placeCircle(circle) {
    var top = getRandomTop(circle)
    var left = getRandomLeft(circle)
    circle.style.setProperty('top', top)
    circle.style.setProperty('left', left)
}

function getRandomTop(circle) {
    var circleStyle = getComputedStyle(circle)
    var height = getPart(circleStyle.height, mainStyle.height) * 100
    var maxTop = 100 - height;
    return Math.random() * maxTop + 'vh'
}

function getRandomLeft(circle) {
    var circleStyle = getComputedStyle(circle)
    var width = getPart(circleStyle.width, mainStyle.width) * 100
    var maxLeft = 100 - width;
    return Math.random() * maxLeft + 'vw'
}

function getPart(counter, denominator) {
    return toFloat(counter) / toFloat(denominator)
}

function toFloat(string) {
    var f = string.replace('px', '')
    return f
}

function getAnimationStyle(circle) {
    var style = circle.getElementsByTagName('style')[0]
    if (style == null) {
        style = document.createElement('style')
        style.type = 'text/css'
        circle.appendChild(style)
    }
    var text = style.getElementsByTagName('text')[0]
    if (text == null) {
        text = document.createTextNode('')
        style.appendChild(text)
    }
    return text
}

function getKeyframes(circle) {
    var circleStyle = getComputedStyle(circle)
    var kf = '@keyframes ' + getAnimationName(circle) + ' {\n'
    kf += '  from { top: ' + circleStyle.top + '; left: ' + circleStyle.left + '; }\n'
    kf += '  to { top: ' + getRandomTop(circle) + '; left: ' + getRandomLeft(circle) + '; }\n'
    kf += '}\n'
    return kf
}

function getAnimationName(circle) {
    return 'move' + circle.getAttribute('number')
}
