const LandOutlineBoardA = {
    8: [
        [325.09, 112.00],
        [337.64, 90.73],
        [343.09, 42.91],
        [364.73, 36.00],
        [374.73, 20.36],
        [403.82, 24.00],
        [427.45, 36.18],
        [432.73, 48.55],
        [479.09, 42.18],
        [462.55, 83.09],
        [445.82, 84.00],
        [422.73, 100.73],
        [408.55, 121.64],
        [415.64, 134.00],
        [415.27, 142.18],
        [404.18, 143.09],
        [390.36, 133.09],
        [373.82, 132.91],
    ],
    7: [
        [300.91, 258.18],
        [287.82, 292.91],
        [287.82, 310.55],
        [325.64, 305.27],
        [346.00, 260.73],
        [358.55, 260.55],
        [385.27, 242.91],
        [396.73, 222.91],
        [389.64, 209.64],
        [391.82, 194.73],
        [414.55, 149.45],
        [414.73, 142.91],
        [404.55, 144.00],
        [390.18, 132.91],
        [372.55, 132.91],
        [327.45, 185.09],
        [324.36, 221.09],
    ],
    6: [
        [266.73, 62.36],
        [250.55, 58.36],
        [250.73, 71.64],
        [238.18, 85.09],
        [241.45, 102.00],
        [239.27, 125.82],
        [246.55, 142.00],
        [270.00, 156.55],
        [301.64, 139.82],
        [336.91, 90.55],
        [342.73, 62.55],
        [341.09, 40.36],
        [305.45, 41.27],
        [291.82, 47.09],
        [285.37, 60.26],
    ],
    5: [
        [250.73, 285.82],
        [275.09, 297.82],
        [279.45, 309.82],
        [286.73, 310.00],
        [287.82, 287.09],
        [324.18, 220.36],
        [326.36, 184.91],
        [370.73, 131.64],
        [325.09, 112.18],
        [288.91, 151.27],
        [267.82, 157.45],
        [248.18, 142.00],
        [215.27, 174.91],
        [264.00, 206.18],
        [264.91, 232.36],
        [253.82, 254.36],
    ],
    4: [
        [159.45, 303.27],
        [170.55, 281.27],
        [170.18, 264.55],
        [162.55, 255.45],
        [146.18, 248.91],
        [163.27, 223.45],
        [172.91, 190.55],
        [204.18, 195.45],
        [216.18, 174.18],
        [239.09, 193.09],
        [264.73, 206.91],
        [263.82, 233.45],
        [252.36, 257.64],
        [251.45, 285.09],
        [221.64, 282.55],
        [205.27, 300.91],
    ],
    3: [
        [21.45, 250.55],
        [20.55, 301.27],
        [68.73, 295.64],
        [76.91, 310.73],
        [108.18, 324.18],
        [126.73, 323.64],
        [134.36, 311.64],
        [158.00, 303.27],
        [170.00, 283.82],
        [168.36, 260.55],
        [148.18, 249.27],
        [109.82, 252.00],
        [76.55, 244.73],
        [66.73, 249.64],
    ],
    2: [
        [76.36, 244.73],
        [107.45, 251.45],
        [145.09, 249.45],
        [164.91, 217.09],
        [176.91, 156.18],
        [169.82, 136.18],
        [172.36, 101.45],
        [156.18, 87.45],
        [135.82, 94.18],
        [131.09, 113.09],
        [122.91, 118.18],
        [112.73, 114.00],
        [103.27, 160.00],
        [76.36, 206.91],
        [74.91, 223.64],
        [83.09, 236.91],
    ],
    1: [
        [176.73, 161.45],
        [174.00, 190.00],
        [204.55, 195.09],
        [216.73, 173.27],
        [246.91, 141.82],
        [239.27, 122.55],
        [239.64, 100.55],
        [241.27, 80.91],
        [251.09, 71.45],
        [250.36, 58.18],
        [228.36, 45.45],
        [223.64, 34.73],
        [189.09, 37.09],
        [159.45, 46.00],
        [170.18, 67.64],
        [157.45, 71.82],
        [155.27, 85.45],
        [170.91, 98.36],
        [169.82, 136.00],
    ]
}

export const LandOutline: { [boardName: string]: { [landNumber: number]: number[][] } } = { "A": LandOutlineBoardA }