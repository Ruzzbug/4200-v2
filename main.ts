// TO BE USED IN THE ONLINE MAKECODE EDITOR
// DOES NOT WORK IN MU
// Connect Neopixel to pin 0
// Connect Dial to pin 1
// Connect external A button to pin 2
// Connect servo motor to pin 12. If you don't have a servo motor, skip this
// If you can, put the final LED on the strip behind the button so it lights it up.
// Pull the neopixel through a hole in the top of the box to represent the flower, a button on the front, and a dial on the side, but towards the front. Like in the render.
// If you can, put a button on the front
// You have a dial/variable resistor with your grove kit, put that on the side
// I found a power bank connected to the grove shield port, as opposed to the microbit port had the best results
// Once the microbit is turned on you have to tell it if it is sending or receiving. Button A is sending, B is receiving.
// Once sending is selected the microbit will display a 1. Once this is done, turn the dial to select a colour, press A to send the colour.
// The flower is now half-open, it is waiting for acknowledgement from a receiving microbit. If you press any button at this stage, the microbit will restart.
// For receiving, all you have to do is press A once a colour appears and the lotus closes.
function Set_Colour (colour_val: number) {
    if (colour_val < 1) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
    } else if (colour_val < 2) {
        strip.showColor(neopixel.colors(NeoPixelColors.Orange))
    } else if (colour_val < 3) {
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    } else if (colour_val < 4) {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
    } else if (colour_val < 5) {
        // Cyan
        strip.showColor(neopixel.rgb(0, 255, 255))
    } else if (colour_val < 6) {
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    } else if (colour_val < 7) {
        strip.showColor(neopixel.colors(NeoPixelColors.Indigo))
    } else if (colour_val < 8) {
        strip.showColor(neopixel.colors(NeoPixelColors.Violet))
    } else if (colour_val < 9) {
        strip.showColor(neopixel.colors(NeoPixelColors.White))
    }
}
// 123 Closed
// 
// 60 Open
function Hold () {
    waiting = 0
    while (waiting == 0) {
        if (input.pinIsPressed(TouchPin.P2) || input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
            waiting = 1
        }
        basic.pause(100)
    }
    control.reset()
}
radio.onReceivedNumber(function (receivedNumber) {
    Receiver(receivedNumber)
})
function Receiver (colour_val2: number) {
    Set_Colour(colour_val2)
    pins.servoWritePin(AnalogPin.P12, closed)
    basic.showLeds(`
        . . # . .
        . # # # .
        . # # # .
        . # # # .
        . . # . .
        `)
    while (ackn == 0) {
        if (input.pinIsPressed(TouchPin.P2) || input.buttonIsPressed(Button.A)) {
            ackn = 1
            pins.servoWritePin(AnalogPin.P12, open)
            btn.showColor(neopixel.colors(NeoPixelColors.Black))
            basic.showLeds(`
                # # . . .
                . . # # #
                # . # . #
                # . # . #
                . # # # .
                `)
            radio.sendString("ackn")
        }
        basic.pause(100)
    }
    Hold()
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "ackn") {
        pins.servoWritePin(AnalogPin.P12, open)
    }
    basic.showLeds(`
        # # . . .
        . . # # #
        # . # . #
        # . # . #
        . # # # .
        `)
    Hold()
})
function Servo (angle: number) {
    pins.servoWritePin(AnalogPin.P12, angle)
}
function Sender () {
    pins.servoWritePin(AnalogPin.P12, closed)
    basic.showLeds(`
        . . # . .
        . # # # .
        . # # # .
        . # # # .
        . . # . .
        `)
    while (!(colour_picked)) {
        colourval = pins.map(
        pins.analogReadPin(AnalogPin.P1),
        0,
        1023,
        0,
        9
        )
        Set_Colour(colourval)
        // set neopixel colour
        // send the colour
        if (input.pinIsPressed(TouchPin.P2) || input.buttonIsPressed(Button.A)) {
            colour_picked = 1
        }
    }
    radio.sendNumber(colourval)
    btn.showColor(neopixel.colors(NeoPixelColors.Black))
    pins.servoWritePin(AnalogPin.P12, half)
    basic.showLeds(`
        . . # . .
        . # # . #
        . # # . #
        . # # . .
        . . # # .
        `)
    Hold()
}
let colourval = 0
let btn: neopixel.Strip = null
let strip: neopixel.Strip = null
let ackn = 0
let waiting = 0
let colour_picked = 0
let closed = 0
let half = 0
let open = 0
open = 100
half = 55
closed = 10
Servo(open)
colour_picked = 0
waiting = 0
ackn = 0
strip = neopixel.create(DigitalPin.P0, 30, NeoPixelMode.RGB)
let flower_col = strip.range(0, 29)
btn = strip.range(30, 30)
strip.showColor(neopixel.colors(NeoPixelColors.Black))
basic.showLeds(`
    # # . . .
    # . . . .
    . . . . .
    . . . . #
    . . . # #
    `)
while (waiting == 0) {
    if (input.pinIsPressed(TouchPin.P2) || input.buttonIsPressed(Button.A)) {
        basic.showString("1")
        waiting = 1
        basic.pause(1000)
        Sender()
    }
    if (input.buttonIsPressed(Button.B)) {
        basic.showString("2")
        waiting = 1
        Servo(open)
        basic.showLeds(`
            # # . . .
            . . # # #
            # . # . #
            # . # . #
            . # # # .
            `)
        basic.pause(1000)
    }
}
