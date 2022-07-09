import React from 'react';

import $ from 'jquery';

import '../App.css';
import './styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';

const KanjiBlock = (blockProps) => {

  const { kanji, romaji, english, ignore } = blockProps.block;

  const onEnterWords = function (event) {
    try {
      var key = event.keyCode;
      var input = event.target;
      var _iptElement = $(input);

      switch (key) {
        case 13: { //enter
          checkWord(input);
          _iptElement.parents('.kanji_block').next().children().find('input').focus();
          break;
        }
        case 17: {//Ctrl
          showWordResult(input);
          break;
        }
        case 9: { //tab
          checkWord(input);
          break;
        }
        case 39: { //forward
          _iptElement.parents('.kanji_block').next().children().find('input').focus();
          break;
        }
        case 37: { //backwward
          _iptElement.parents('.kanji_block').prev().children().find('input').focus();
          break;
        }
        default: {
          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkWord = function (input) {
    try {
      var _iptElement = $(input);
      var _value = input.value.trim();
      var _strExpectedResult = "";
      var _arrToVerbExpectedResult = [];
      var _arrNonToVerbExpectedResult = [];

      var _blResult = false;

      if (_value !== "") {
        // Check result
        // attr() return as String
        _strExpectedResult = _iptElement.parent().find('.result_kanji').attr('result').toLowerCase();

        var _strNonToVerbResult = _strExpectedResult.slice();
        var _strToVerbResult = _strExpectedResult.slice();

        // Handle (V) with "to"
        if (_strExpectedResult.indexOf("to ") !== -1) {
          _strNonToVerbResult = _strNonToVerbResult.replace("to ", "");
        }

        // Handle ignore list
        // Return array to be check against input value
        _arrNonToVerbExpectedResult = finalizeExpectedResult(input, _strNonToVerbResult);
        _arrToVerbExpectedResult = finalizeExpectedResult(input, _strToVerbResult);

        // Return result
        _blResult = _arrNonToVerbExpectedResult.indexOf(_value.toLowerCase()) !== -1
          || _arrToVerbExpectedResult.indexOf(_value.toLowerCase()) !== -1;

        // Display result on block
        displayResult(input, _blResult);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Display result on block
  const displayResult = function (input, result) {
    try {
      var _iptElement = $(input);
      var _strExpectedResult = _iptElement.parent().find('.result_kanji').attr('result').toLowerCase();

      if (result) {
        // input
        _iptElement.removeClass("text-danger").addClass("text-success");

        // result
        _iptElement.parent().find('.result_kanji').removeClass("text-danger").addClass("text-success").text(_strExpectedResult);

        // move to next word
        _iptElement.parents('.kanji_block').next().children().eq(1).find('input').focus();

        // pass success to parent
        blockProps.onKeyDown("correct");
      }
      else {
        _iptElement.removeClass("text-success").addClass("text-danger");
        _iptElement.parent().find('.result_kanji').removeClass("text-success").addClass("text-danger").text("Failed");

        // pass failed to parent
        blockProps.onKeyDown("failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const finalizeExpectedResult = function (input, srcString) {
    var _resArray = [];
    try {
      var _strIgnore = $(input).parent().find('.ignore-list').text();
      var _arrTempIgnore = [];

      if (_strIgnore !== "") {
        if (_strIgnore.indexOf(",") !== -1) {
          _arrTempIgnore = _strIgnore.split(",").map(function (item) {
            return item.trim();
          });
        }
        else {
          _arrTempIgnore.push(_strIgnore.trim());
        }

        // Minus ignore list from expected result
        srcString = minusSubString(_arrTempIgnore, srcString);
      }

      // Array to be check against input value
      _resArray = srcString.split(",").map(function (item) {
        return item.trim();
      });

    } catch (error) {
      console.log(error);
    }
    return _resArray;
  }


  // Minus sub-string
  const minusSubString = function (srcArray, destString) {
    try {
      for (var i = 0; i < srcArray.length; i++) {
        for (var j = 0; j < destString.length; j++) {
          if (srcArray[i] !== "") {
            var sliced = destString.slice(j, j + srcArray[i].length);
            if (sliced === srcArray[i]) {
              destString = destString.slice(0, j) + destString.slice(j + srcArray[i].length + 1, destString.length);
              j += srcArray[i].length;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
    return destString;
  }

  // Show word result
  const showWordResult = function (input) {
    var _iptElement = $(input);
    var _expectedResult = [];

    _expectedResult = _iptElement.parent().find('.result_kanji').attr('result');

    _iptElement.parent().find('.result_kanji').removeClass("text-success").addClass("text-danger").text(_expectedResult);
    _iptElement.val("");
  }

  const onFocusChange = function (event) {
    // remove others
    $('.item-selected').removeClass('item-selected');

    // set to current block
    var _kanjiBlock = $(event.target).parents('.kanji_block');
    _kanjiBlock.addClass('item-selected');
  }

  const onKanjiBlockClick = function (event) {
    // remove others
    $('.item-selected').removeClass('item-selected');

    var _kanjiBlock = $(event.target).parents('.kanji_block');
    _kanjiBlock.addClass('item-selected');
    _kanjiBlock.find('.form-control').focus();

  }

  return (
    <div className='col-6 col-md-2 kanji_block' onClick={onKanjiBlockClick}>
      <div className='kanji_contain'>
        <span>{kanji}</span>
      </div>
      <div className='note-romaji'>
        <span>{romaji}</span>
      </div>
      <div className='kanji_result_contain'>
        <div className='result-english'>
          <span>Result: </span>
          <span className='result_kanji' result={english}></span>
        </div>
        <div className='note-english'>
          <span>Hint:  </span>
          <span className='ignore-list'>{ignore}</span>
        </div>
        {/* If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `kanjikey` instead. */}
        <input className='form-control' onKeyDown={onEnterWords} onFocus={onFocusChange} />
      </div>
    </div>
  )
};

export default KanjiBlock;
