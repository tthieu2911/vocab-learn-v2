import React, { useState } from 'react';

import logo from '../../src/logo.svg';
import './styles.css';
import '../App.css';

import $ from 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';

import { FaFileUpload } from 'react-icons/fa';
import { BsArrowsMove, BsArrowBarRight, BsArrowReturnLeft, BsArrowLeft, BsArrowRight, BsInfoLg } from 'react-icons/bs';
import { FiRefreshCw } from 'react-icons/fi';
import { AiOutlineClear } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';


// Imported components should be started with capital letters: KanjiBlock not kanjiBlock
import KanjiBlock from '../kanjiBlock';

const Kanji = (kanjiProps) => {

  const [kanjiList, setKanjiList] = useState('');
  const [showing, setShowing] = useState('');

  var vocabDictionary = [];

  function mixKanjiWord() {
    try {
      // mix Kanji blocks
      var _blocks = $(".kanji_block");
      for (var i = 0; i < _blocks.length; i++) {
        var _target1 = Math.floor(Math.random() * _blocks.length - 1) + 1;
        var _target2 = Math.floor(Math.random() * _blocks.length - 1) + 1;
        _blocks.eq(_target1).before(_blocks.eq(_target2));
      }

      // reset value
      $('.kanji_block').each(function () {
        $(this).find(':input').val("");
        $(this).find('.result_kanji').html('');
      });
    } catch (error) {
      console.log(error);
    }
  }

  function clearAll() {
    $('#kanji_area:input').val("");
    $('.result_kanji').html('');
  }

  var updateResult = function (value) {
    try {
      // value = data passed from Children 's function: onKeyDown = {onEnterWords}

      var _correctInput = $(':input.text-success');
      var _failedInput = $(':input.text-danger');

      $('#correctCount').text(_correctInput.length);
      $('#failedCount').text(_failedInput.length);

    } catch (error) {
      console.log(error);
    }
  }

  const loadData = () => {
    try {
      // init data
      $('#correctCount').text("0");
      $('#failedCount').text("0");

      // clear input
      clearAll();

      // clear focus
      $('.item-selected').removeClass('item-selected');

      var _intNumber = $("#total").val();
      var _intLevel = $("#level option:selected").val();
      var _strfileName = "";

      switch (parseInt(_intLevel)) {
        case 5:
          _strfileName = "file/kanji-5.txt";
          break;
        case 4:
          _strfileName = "file/kanji-4.txt";
          break;
        case 3:
          _strfileName = "file/kanji-3.txt";
          break;
        case 2:
          _strfileName = "file/kanji-2.txt";
          break;
        case 1:
          _strfileName = "file/kanji-1.txt";
          break;
        default:
          _strfileName = "file/kanji-5.txt";
          break;
      }

      // Import data from text file
      importData(_strfileName, _intNumber);

    } catch (error) {
      console.log(error);
    }
  }

  // Import data from local file
  function importData(fileName, inputNumber) {
    try {
      $.get(fileName, function (data, res) {
        vocabDictionary = [];
        var ignoreList = [];
        if (res) {
          var lines = data.toString().replaceAll("\r\n", "\n").split("\n");

          //var lines = data.split("\r\n".charCodeAt(0));

          for (var i = 0; i < lines.length; i++) {
            if (lines[i] === "" || lines[i] === undefined) {
              continue;
            }
            var words = lines[i].split("/");
            var wordsObj = {};

            // Create object words
            if (words.length === 2) {
              wordsObj = {
                "kanji": words[0],
                "romaji": "",
                "english": words[1],
                "ignore": ""
              }
            } else {
              // Handle '(' .. ')' --> to be ignored
              ignoreList = hanldeIgnoreList(words[2]);

              wordsObj = {
                "kanji": words[0],
                "romaji": words[1],
                "english": words[2],
                "ignore": ignoreList
              }
              ignoreList = [];
            }

            // Push to Dictionary
            vocabDictionary.push(wordsObj);
            wordsObj = {};
          }

          displayWord(inputNumber);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function hanldeIgnoreList(srcString) {
    try {
      var resArray = [];
      if (srcString.lastIndexOf('(') !== -1 && srcString.lastIndexOf(')') !== -1) {

        // get all Indexes of Open & Close charater
        var index = 0;
        var indicesOpen = [];
        for (index = 0; index < srcString.length; index++) {
          if (srcString[index] === "(") indicesOpen.push(index);
        }
        var indicesClose = [];
        for (index = 0; index < srcString.length; index++) {
          if (srcString[index] === ")") indicesClose.push(index);
        }

        // Get list of ignore phrase
        // Open and Close charater should have same total
        for (index = 0; index < indicesOpen.length; index++) {
          if (index + 1 < indicesOpen.length) {
            resArray.push((srcString.slice(indicesOpen[index], indicesClose[index] + 1)) + ", ");
          } else {
            resArray.push((srcString.slice(indicesOpen[index], indicesClose[index] + 1)));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }

    return resArray;
  }

  function displayWord(inputNumber) {
    try {
      // Suffle imported dictionary
      var _suffledDict = suffleDictionary(vocabDictionary);

      // Slice into new Dictionary w specific number
      var _arrWordDictToDisplay = [];
      var _intNumber = inputNumber === "" ? 0 : parseInt(inputNumber);

      switch (true) {
        case _intNumber === 0: {
          _arrWordDictToDisplay = _suffledDict;
          break;
        }
        case _intNumber !== 0 && _intNumber <= vocabDictionary.length: {
          _arrWordDictToDisplay = _suffledDict.slice(0, _intNumber);
          break;
        }
        case _intNumber !== 0 && _intNumber > vocabDictionary.length: {
          _arrWordDictToDisplay = _suffledDict;
          break;
        }
        default: {
          _arrWordDictToDisplay = _suffledDict;
          break;
        }
      }

      // Create Kanji list
      setKanjiList(_arrWordDictToDisplay);

    } catch (error) {
      console.log(error);
    }
  }

  function suffleDictionary(inputDict) {
    var newDict = inputDict.slice();
    try {
      var currIndex = inputDict.length, tmpItems, randIndex;

      while (0 !== currIndex) {
        // Get random index
        randIndex = Math.floor(Math.random() * currIndex);
        currIndex -= 1;
        // swap items
        tmpItems = newDict[currIndex];
        newDict[currIndex] = newDict[randIndex];
        newDict[randIndex] = tmpItems;
      }
    } catch (error) {
      console.log(error);
    }
    return newDict;
  }

  const showGuideLine = function (event) {
    try {
      setShowing(!showing);

      var _element = $(event.target)

      if (!showing) {
        _element.parents('.App').find('.body').addClass('blur-filter');
      } else {
        _element.parents('.App').find('.body').removeClass('blur-filter');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onLoadHandler = function () {
    try {
      $('#correctCount').text("0");
      $('#failedCount').text("0");
    } catch (error) {
      console.log(error);
    }
  }


  //#region Rendering
  return (
    <div className="App" onLoad={onLoadHandler}>
      <header>
      </header>
      <div className="popup-modal-field">
        <div className="guide-details px-0" style={{ display: (showing ? 'block' : 'none') }}>
          <div className="guide-details-header">
            <span className="hvr-grow hvr-icon " onClick={showGuideLine} ><FiDelete /></span>
          </div>
          <div className="row guide-details-content">
            <div className="col-md-2 col-sm-6 col-6">
              <span className="guide-icon hvr-grow"><BsArrowsMove />  Ctrl </span>
              <span className="guide-text"> Show result </span>
            </div>
            <div className="col-md-5 col-sm-6 col-6">
              <span className="guide-icon hvr-grow"><BsArrowBarRight />  Tab </span>
              <span> or </span>
              <span className="guide-icon hvr-grow"><BsArrowReturnLeft />  Enter </span>
              <span className="guide-text"> Check result </span>
            </div>
            <div className="col-md-5 col-sm-4 col-4 px-0">
              <div className="row px-0">
                <div className="col-md-6 col-sm-6 col-6">
                  <span className="guide-icon hvr-grow"><BsArrowLeft />  Left </span>
                  <span className="guide-text"> Previous box </span>
                </div>
                <div className="col-md-6 col-sm-6 col-6">
                  <span className="guide-icon hvr-grow"><BsArrowRight />  Right </span>
                  <span className="guide-text"> Next box </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="container-fluid" id="header_div">
          <div className="container-fluid px-0 App-header" >
            <div className="row">
              <div className="col-md-2 col-sm-2 col-2"></div>
              <div className="col-md-8 col-sm-8 col-8 row" >
                <div className="col-md-4 col-sm-4 col-4"><img src={logo} className="App-logo" alt="logo" /></div>
                <div className="col-md-4 col-sm-4 col-4" align-text="left"><h1>LEARNING</h1></div>
                <div className="col-md-4 col-sm-4 col-4"></div>
              </div>
              <div className="col-md-2 col-sm-2 col-2"></div>
            </div>
          </div>
        </div>

        <div className="container-fluid" id="kanji_div" >
          <div className="container-fluid px-0" id="kanji_header">
            <div className="row">
              <div className="col-md-2 col-sm-2 col-2"></div>
              <div className="col-md-8 col-sm-8 col-8">
                <h2 className="text-center"> KANJI MODE </h2>
              </div>
              <div className="col-md-2 col-sm-2 col-2"></div>
            </div>
            <div className="guide-area">
              <div className="guide-button">
                <button type="button" className="toggle-button btn-info-cus" title="Help" onClick={showGuideLine}>
                  <BsInfoLg />
                </button>
              </div>

            </div>
            <div className="container-fluid px-0 button-fields" id="buttons-area">
              <div className="row px-0">
                <div className="col-md-6 col-sm-12 col-12 row load-data-criteria">
                  <div className="col-md-4 col-sm-4 col-4 level-select">
                    Level :
                    <select id="level">
                      <option value="5">N5</option>
                      <option value="4">N4</option>
                      <option value="3">N3</option>
                      <option value="2">N2</option>
                      <option value="1">N1</option>
                    </select>
                  </div>
                  <div className="col-md-4 col-sm-4 col-4 no-of-words" >
                    No of Words :
                    <input className='form-control-inline' id='total' type="number" min="1" />
                  </div>
                  <div className="col-md-4 col-sm-4 col-4 hvr-bob hvr-icon-up btn-load-data">
                    <button type="button" className="btn btn-warning" onClick={() => loadData()}>
                      <FaFileUpload className="hvr-icon" />
                      <span> Load data </span>
                    </button>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12 col-12 row">
                  <div className="col-md-4 col-sm-4 col-4 hvr-bob hvr-icon-spin btn-mix-words">
                    <button type="button" className="btn btn-success" onClick={() => mixKanjiWord()}>
                      <FiRefreshCw className="hvr-icon" />
                      <span> Mix Words </span>
                    </button>
                  </div>
                  <div className="col-md-4 col-sm-4 col-4 hvr-bob hvr-icon-wobble-horizontal btn-clear-all ">
                    <button type="button" className="btn btn-primary" onClick={() => clearAll()}>
                      <AiOutlineClear className="hvr-icon" />
                      <span> Clear All </span>
                    </button>
                  </div>
                  <div className="col-md-4 col-sm-4 col-4 px-0">
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-6 test-result">
                        <span className="text-success">Correct</span>
                      </div>
                      <div className="col-md-6 col-sm-6 col-6 test-count">
                        <span id="correctCount"></span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-6 test-result">
                        <span className="text-danger">Failed</span>
                      </div>
                      <div className="col-md-6 col-sm-6 col-6 test-count">
                        <span id="failedCount"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid" id="kanji_area_div">
          <hr />
          <div id="kanji_area">
            <div className="row">
              {/* <!-- Kanji list --> */}
              {kanjiList.length !== 0 &&
                kanjiList.map((item, index) =>
                  <KanjiBlock key={index} block={item} onKeyDown={updateResult} />
                )
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  );
  //#endregion
}

export default Kanji;
