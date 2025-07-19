const visibleCheckBox = document.getElementById('visibleCheckBox');
visibleCheckBox.addEventListener('input', () => {
    const emptyObj = window.emptyObj;
    if (emptyObj) {
        emptyObj[0].visible = !emptyObj[0].visible;
        emptyObj[1].visible = !emptyObj[1].visible;
    }
});

const chainLengthSlider = document.getElementById('chainLengthSlider');
const chainLengthValueDisplay = document.getElementById('chainLengthValue');
// 初期表示
chainLengthValueDisplay.textContent = chainLengthSlider.value;
chainLengthSlider.addEventListener('input', () => {
    const value = parseFloat(chainLengthSlider.value);
    const setChainPieceLength = window.setChainPieceLength;

    chainLengthValueDisplay.textContent = value;
    if (setChainPieceLength) {
        setChainPieceLength(value);
    }
});

const chainAngleOffetSlider = document.getElementById('chainAngleOffsetSlider');
const chainAngleOffsetValueDisplay = document.getElementById('chainAngleOffsetValue');
// 初期表示
chainAngleOffsetValueDisplay.textContent = chainAngleOffetSlider.value;
chainAngleOffetSlider.addEventListener('input', () => {
    const value = parseFloat(chainAngleOffetSlider.value);
    const setChainAngleOffset = window.setChainAngleOffset;

    chainAngleOffsetValueDisplay.textContent = value;
    if (setChainAngleOffset) {
        setChainAngleOffset(value);
    }
});

const chainAngleRandomFactor = document.getElementById('chainAngleRandomFactor');
const randomFactorValueDisplay = document.getElementById('chainAngleRandomValue');
// 初期表示
randomFactorValueDisplay.textContent = chainAngleRandomFactor.value;
chainAngleRandomFactor.addEventListener('input', () => {
    const value = parseFloat(chainAngleRandomFactor.value);
    const setChainAngleRandomFactor = window.setChainAngleRandomFactor;

    randomFactorValueDisplay.textContent = value;
    if (setChainAngleRandomFactor) {
        setChainAngleRandomFactor(value);
    }
});

const aFactor = document.getElementById('aFector');
const aFactorValueDisplay = document.getElementById('aFectorValue');
// 初期表示
aFactorValueDisplay.textContent = aFactor.value;
aFactor.addEventListener('input', () => {
    const value = parseFloat(aFactor.value);
    const setAFactor = window.setAFactor;

    aFactorValueDisplay.textContent = value;
    if (setAFactor) {
        setAFactor(value * 9 + 1);
    }
});