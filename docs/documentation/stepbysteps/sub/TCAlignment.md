
<div class="page-title">
  <a href="javascript:history.back()" class="back-inline" aria-label="Back">←</a>
  <h1>Twin Column Alignment</h1>
</div>


**CMES Commands**

CS = Check Status
DP = Display/ DRO
DA = Disable Auto
TI = Transfer Input
LR = List Reset

RH Machine is always Master, 
LH Machine is always Slave

---

**NEVER HIT THE ENTER BUTTON ON HANDBOX WHEN USING CMES!!!!!**

Step 1 –Delete the VMF files (C: > Users > WWCSI > Appdata > Local > Virtual Store > Program Files 86 > LK) Camio 7.2
C:\Program Files (x86)\LK\6.2\LKWincmes Camio 6.2

Step 2 – Open CMES

Step 3 – Make sure Tips / Resets are set at 0 using LR command in CMES

Step 4 – Search on laptop for MMA.GLO file make sure there isn’t a previous file (if so delete it).

Step 5 – Se,wk:caliprgs

Step 6 – CS to check status to make sure caliprgs appears

Step 7 – Ti,ervball.bar to collect sensors

Step 8 – Hit escape button after machine finishes collecting sensors

Step 9 – ti,twinali.tst CMES will ask for X & Z axis min. and max limits (enter false limits to find in which order you need to input them)

Step 10 – Find axis limits WRITE DOWN

Step 11 – Enter limits

Step 12 – Find MMA.GLO

Step 13 – Copy over MMA.GLO file to other Computer (C: > User > WWCSI > Appdata > Local > Virtual Store > Program Files 86 > LK > WinCmes

Step 14 – Follow Instructions 

Step 15 – Caliprgs results make sure file is there

Step 16 – Vecpd Slave side only

Step 17 – Run option 8 in Vecpd

Step 18 – Follow Instructions

Step 19 – Enter in coordinates in Vecpd

Step 20 – WRITE DOWN ARC SECOND COMP

Step 21 – RINSE & REPEAT TO ENSURE NUMBERS ARE GOOD
