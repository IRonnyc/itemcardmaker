<?php
include 'head.php';
?>

<div id="toolbar">
    <button id="addcard" onclick="addCard()">Add new Card</button>
    <button id="loadcard" onclick="loadCard()">Load Card</button>
    <input type="file" id="fileSelector">
</div>
<div id="cardcontainer">
    <div id="cardprototype" class="card">
        <div class="card-toolbar card-row">
            <button class="remove-card">remove</button>
            <button class="export-card">export</button>
        </div>
        <div class="card-row">
            <div class="card-title textfield" contenteditable="true" onfocus="startEditing(this)" onblur="stopEditing(this)">CARD TITLE</div>
            <div class="card-level-label">ITEM</div>
            <div class="card-level textfield" contenteditable="true" onfocus="startEditing(this)" onblur="formatInput(this)">1+</div>
        </div>
        <div class="card-row">
            <div class="card-tags textfield" contenteditable="true" onfocus="startEditing(this)" onblur="formatInput(this)">
                Tags<br />
                magical
            </div>
            <div class="card-meta-data textfield" contenteditable="true" onfocus="startEditing(this)" onblur="formatInput(this)">
                <b>Activation:</b> 1 Operate Activation<br />
                <b>Bulk:</b> 1
            </div>
        </div>
        <div class="card-row">
            <div class="card-description textfield" contenteditable="true" onfocus="startEditing(this)" onblur="formatInput(this)">
                Beschreibung der Karte
            </div>
        </div>
    </div>
    <!--<div id="cardprototype" class="card">
        <div class="card-toolbar card-row">
            <button class="remove-card">remove</button>
            <button class="export-card">export</button>
        </div>
        <div class="card-titlebar card-row">
            <input type="text" class="item-title" placeholder="Item of Awesome">
            <span class="item-label">ITEM</span>
            <input type="text" class="item-level" placeholder="1+">
        </div>
        <div class="card-infobar card-row">
            <textarea name="tags" class="item-tags" rows="2" placeholder="Magical" oninput='this.style.height = (this.scrollHeight) + "px"'></textarea>
            <textarea name="metadata" class="item-meta-data" placeholder="Price: 50 gp, Method of Use: held, 1 hand, Bulk: 1, and Activation: 1 Operate Activation" oninput='this.style.height = (this.scrollHeight) + "px"'></textarea>
        </div>
        <textarea name="description" class="item-description" placeholder="While holding this Item in your hand, you are awesome!" oninput='this.style.height = (this.scrollHeight) + "px"'></textarea>
    </div>-->
</div>

<?php
include 'foot.php';
?>
