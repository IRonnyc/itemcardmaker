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
        <div class="card-row card-infobar">
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
</div>

<?php
include 'foot.php';
?>
