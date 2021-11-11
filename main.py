# TO BE USED IN THE ONLINE MAKECODE EDITOR
# DOES NOT WORK IN MU
# Connect Neopixel to pin 0
# Connect Dial to pin 1
# Connect external A button to pin 2
# Connect servo motor to pin 12. If you don't have a servo motor, skip this
# If you can, put the final LED on the strip behind the button so it lights it up.
# Pull the neopixel through a hole in the top of the box to represent the flower, a button on the front, and a dial on the side, but towards the front. Like in the render.
# If you can, put a button on the front
# You have a dial/variable resistor with your grove kit, put that on the side
# I found a power bank connected to the grove shield port, as opposed to the microbit port had the best results
# Once the microbit is turned on you have to tell it if it is sending or receiving. Button A is sending, B is receiving.
# Once sending is selected the microbit will display a 1. Once this is done, turn the dial to select a colour, press A to send the colour.
# The flower is now half-open, it is waiting for acknowledgement from a receiving microbit. If you press any button at this stage, the microbit will restart.
# For receiving, all you have to do is press A once a colour appears and the lotus closes.
def Set_Colour(colour_val: number):
    if colour_val < 1:
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
    elif colour_val < 2:
        strip.show_color(neopixel.colors(NeoPixelColors.ORANGE))
    elif colour_val < 3:
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
    elif colour_val < 4:
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
    elif colour_val < 5:
        # Cyan
        strip.show_color(neopixel.rgb(0, 255, 255))
    elif colour_val < 6:
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
    elif colour_val < 7:
        strip.show_color(neopixel.colors(NeoPixelColors.INDIGO))
    elif colour_val < 8:
        strip.show_color(neopixel.colors(NeoPixelColors.VIOLET))
    elif colour_val < 9:
        strip.show_color(neopixel.colors(NeoPixelColors.WHITE))
# 123 Closed
# 
# 60 Open
def Hold():
    global waiting
    waiting = 0
    while waiting == 0:
        if input.pin_is_pressed(TouchPin.P2) or input.button_is_pressed(Button.A) or input.button_is_pressed(Button.B):
            waiting = 1
        basic.pause(100)
    control.reset()

def on_received_number(receivedNumber):
    Receiver(receivedNumber)
radio.on_received_number(on_received_number)

def Receiver(colour_val2: number):
    global ackn
    Set_Colour(colour_val2)
    pins.servo_write_pin(AnalogPin.P12, closed)
    basic.show_leds("""
        . . # . .
                . # # # .
                . # # # .
                . # # # .
                . . # . .
    """)
    while ackn == 0:
        if input.pin_is_pressed(TouchPin.P2) or input.button_is_pressed(Button.A):
            ackn = 1
            pins.servo_write_pin(AnalogPin.P12, open)
            btn.show_color(neopixel.colors(NeoPixelColors.BLACK))
            basic.show_leds("""
                # # . . .
                                . . # # #
                                # . # . #
                                # . # . #
                                . # # # .
            """)
            radio.send_string("ackn")
        basic.pause(100)
    Hold()

def on_received_string(receivedString):
    if receivedString == "ackn":
        pins.servo_write_pin(AnalogPin.P12, open)
    basic.show_leds("""
        # # . . .
                . . # # #
                # . # . #
                # . # . #
                . # # # .
    """)
    Hold()
radio.on_received_string(on_received_string)

def Servo(angle: number):
    pins.servo_write_pin(AnalogPin.P12, angle)
def Sender():
    global colourval, colour_picked
    pins.servo_write_pin(AnalogPin.P12, closed)
    basic.show_leds("""
        . . # . .
                . # # # .
                . # # # .
                . # # # .
                . . # . .
    """)
    while not (colour_picked):
        colourval = pins.map(pins.analog_read_pin(AnalogPin.P1), 0, 1023, 0, 9)
        Set_Colour(colourval)
        # set neopixel colour
        # send the colour
        if input.pin_is_pressed(TouchPin.P2) or input.button_is_pressed(Button.A):
            colour_picked = 1
    radio.send_number(colourval)
    btn.show_color(neopixel.colors(NeoPixelColors.BLACK))
    pins.servo_write_pin(AnalogPin.P12, half)
    basic.show_leds("""
        . . # . .
                . # # . #
                . # # . #
                . # # . .
                . . # # .
    """)
    Hold()
colourval = 0
btn: neopixel.Strip = None
strip: neopixel.Strip = None
ackn = 0
waiting = 0
colour_picked = 0
closed = 123
Servo(closed)
open = 60
half = 90
colour_picked = 0
waiting = 0
ackn = 0
strip = neopixel.create(DigitalPin.P0, 30, NeoPixelMode.RGB)
flower_col = strip.range(0, 29)
btn = strip.range(30, 30)
strip.show_color(neopixel.colors(NeoPixelColors.BLACK))
basic.show_leds("""
    # # . . .
        # . . . .
        . . . . .
        . . . . #
        . . . # #
""")
while waiting == 0:
    if input.pin_is_pressed(TouchPin.P2) or input.button_is_pressed(Button.A):
        basic.show_string("1")
        waiting = 1
        basic.pause(1000)
        Sender()
    if input.button_is_pressed(Button.B):
        basic.show_string("2")
        waiting = 1
        Servo(open)
        basic.show_leds("""
            # # . . .
                        . . # # #
                        # . # . #
                        # . # . #
                        . # # # .
        """)
        basic.pause(1000)