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
let categories = {};
for (let [key, value] of Object.entries(Blockly.Blocks)) {
  if (value.template && value.category)
    categories[value.category] += value.template;
}
let cats = "";

cats +=
  '<category name="Atomic" iconURI="./media/atomic-ninja-icon.png">' +
  categories["Atomic"] +
  "</category>";

cats +=
  '<category name="Uniswap" iconURI="https://uniswap.exchange/static/media/logo_white.edb44e56.svg" >' +
  categories["Uniswap"] +
  "</category>";

cats +=
  '<category name="Aave" iconURI="./media/aaveghost.svg">' +
  categories["Aave"] +
  "</category>";

cats +=
  '<category name="Compound" iconURI="https://compound.finance/images/compound-mark.svg">' +
  categories["Compound Finance"] +
  "</category>";

cats +=
  '<category name="Defi Zaps" iconURI="https://defizap.com/static/media/save-gas.81e35b11.svg">' +
  categories["DeFi Zaps"] +
  "</category>";

cats +=
  '<category name="Balancer" iconURI="https://gblobscdn.gitbook.com/spaces%2F-LtMQYB90ZuO38aKDyto%2Favatar.png">' +
  categories["Balancer"] +
  "</category>";

cats +=
  '<category name="PoolTogether" iconURI="https://www.pooltogether.com/_next/static/images/pool-together--purple-wordmark-8040268169fe12bd47b82655dc0923ce.svg">' +
  categories["Pool Together"] +
  "</category>";
cats +=
  '<category name="ENS" iconURI="./media/ens.png" showStatusButton="false">' +
  categories["ENS"] +
  "</category>";

Blockly.Blocks.defaultToolbox =
  '<xml id="toolbox-categories" style="display: none">' + cats + "</xml>";

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
