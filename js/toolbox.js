/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

goog.provide("Blockly.Blocks.defaultToolbox");

goog.require("Blockly.Blocks");

/**
 * @fileoverview Provide a default toolbox XML.
 */

Blockly.Blocks.defaultToolbox =
  '<xml id="toolbox-categories" style="display: none">' +
  '<category name="ATOMIC" id="erc20" colour="#FF6680" secondaryColour="#FF4D6A" ' +
  'iconURI="./media/atomic-ninja-icon.png" showStatusButton="true">';

for (let [key, value] of Object.entries(Blockly.Blocks)) {
  if (value.template) Blockly.Blocks.defaultToolbox += value.template;
}

Blockly.Blocks.defaultToolbox += "</category>" + "</xml>";

// Context menus
Blockly.Msg.DUPLICATE = "Duplicate";
Blockly.Msg.DELETE = "Delete";
Blockly.Msg.ADD_COMMENT = "Add Comment";
Blockly.Msg.REMOVE_COMMENT = "Remove Comment";
Blockly.Msg.DELETE_BLOCK = "Delete Block";
Blockly.Msg.DELETE_X_BLOCKS = "Delete %1 Blocks";
Blockly.Msg.DELETE_ALL_BLOCKS = "Delete all %1 blocks?";
Blockly.Msg.CLEAN_UP = "Clean up Blocks";
Blockly.Msg.HELP = "Help";
Blockly.Msg.UNDO = "Undo";
Blockly.Msg.REDO = "Redo";
Blockly.Msg.EDIT_PROCEDURE = "Edit";
Blockly.Msg.SHOW_PROCEDURE_DEFINITION = "Go to definition";
Blockly.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT = "Say something...";
