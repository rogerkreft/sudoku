var mainStyle

function initCircles() {
    try {
        mainStyle = getComputedStyle(document.querySelector('main'))
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
    } catch (err) {
        console.log('ERROR initializing circles:', err)
    }
}

function getAnimationName(circle) {
    return 'move' + circle.getAttribute('number')
}

function animateCircle(circle) {
    placeCircle(circle)
    var animationStyle = getStyleElementOf(circle)
    animationStyle.textContent = getKeyframes(circle)
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
    return toNumber(counter) / toNumber(denominator)
}

function toNumber(s) {
    return +s.replace('px', '')
}

function getStyleElementOf(element) {
    var style = element.getElementsByTagName('style')[0]
    if (style == null) {
        style = document.createElement('style')
        style.type = 'text/css'
        element.appendChild(style)
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
