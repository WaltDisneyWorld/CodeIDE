/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 
 ------------------------------------------------------------------
  File Load/Save
 ------------------------------------------------------------------
**/
"use strict";
(function(){
  
  function init() {
    // Configuration
   
    // Add stuff we need
    $('<button class="load">Load File</button>').appendTo(".toolbar .right");
    //$('<button class="reload">Reload File</button>').appendTo(".toolbar .right");
    $('<button class="save">Save File</button>').appendTo(".toolbar .right");
    
    $('<input type="file" id="fileLoader" style="display: none;"/>').appendTo(document.body);
     
    $( ".load" ).button( { text: false, icons: { primary: "ui-icon-folder-open" } } ).click( function () {
      $( "#fileLoader" ).click();
    });
    /*/$( ".reload" ).button( { text: false, icons: { primary: "ui-icon-refresh" } } ).click( function () {
      $('#fileLoader').change();
    });*/
    $( ".save" ).button({ text: false, icons: { primary: "ui-icon-disk" } }).click(function() {
      if (Espruino.Core.Layout.isInBlockly()) 
        saveFile(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)), "code_blocks.xml");
      else
        saveFile(Espruino.Core.Code.getJavaScript(), "code.js");
    });
    
    $("#fileLoader").change(function(event) {
      if (event.target.files.length != 1) return;
      var reader = new FileReader();
      reader.onload = function(event) {
        var data = convertFromOS(event.target.result);
        if (Espruino.Core.Layout.isInBlockly()) {
          Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, Blockly.Xml.textToDom(data));          
        } else { 
          Espruino.codeEditor.setValue(data);
        }
        document.getElementById('load').value = '';
      };
      reader.readAsText(event.target.files[0]);
    });
        
  }
  
  /**  Handle newline conversions - Windows expects newlines as /r/n when we're saving/loading files */
  function convertFromOS(chars) {
   if (!Espruino.Core.Utils.isWindows()) return chars;
   return chars.replace(/\r\n/g,"\n");
  };
  
  /**  Handle newline conversions - Windows expects newlines as /r/n when we're saving/loading files */
  function convertToOS(chars) {
   if (!Espruino.Core.Utils.isWindows()) return chars;
   return chars.replace(/\r\n/g,"\n").replace(/\n/g,"\r\n");
  };  
  
  var saveFile = function(data, filename) {
    saveAs(new Blob([convertToOS(data)], { type: "text/plain" }), filename);
  };  

  Espruino.Core.Send = {
    init : init
  };
}());