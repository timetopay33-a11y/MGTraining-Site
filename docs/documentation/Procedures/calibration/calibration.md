
<div class="page-title">
  <a href="javascript:history.back()" class="back-inline" aria-label="Back">←</a>
  <h1>Calibration Procedure</h1>
</div>

 Source:
    6-Notes/StepBySteps/Calibrations

---
Utilizes –
WWCSI Laptop with Camio 7.2 & Caliprogs
Free Standing Ballbar
XL80 Laser Kit w linear optics
Hand tools & Cleaning Supplies

This Basic Calibration form is meant to guide trainees through basic calibration of a bridge style machine of approx. G90C 10.10.8 build. It is impossible to address every possible situation in the field, but this will be as thorough as possible.

---


    1. Preparation for any Job
        1.1. Book Hotel
        1.2. Call customer with ETA after Departure
    2. Arrival
        2.1. Call customer approx. 20 min before arrival
        2.2. Take in tools, take gauges to allow for acclimation time
        2.3. Setup ball bar 60% of shortest axis
    3. Initial observation
        3.1. Machine condition?
            3.1.1.  If not running
                3.1.1.1. Figure out machine history
                3.1.1.2. Before data can likely be skipped
                3.1.1.3. Complete machine PM work first
                3.1.1.4. Notify client office and wwcsi Management if extensive work is required
            3.1.2.  Extremely filthy 
                3.1.2.1. Collect before data, be prepared for issues
            3.1.3.  Noise or shaking in axis
                3.1.3.1. Collect before data, be prepared for issues
        3.2.  Note Client software(s) & Any tool changers
            3.2.1.  Tip changers May require removal later
                3.2.1.1. Take pictures before any removal of tip changers
        3.3.  Request removal of all clutter on machine table 
            3.3.1. Can include fixture plates (wait until laser process if plate is non obtrusive)
    4. Before data
        4.1. Setup laptop 
            4.1.1.  Copy CMMCFG and ERRC Folders from customer PC onto flash drive
            4.1.2. Delete from files on flash drive all but the following
                    4.1.2.1.1. CMMCFG file
                        4.1.2.1.1.1. LKCmmdrv.cfg
                        4.1.2.1.1.2. Lkcmm.cfg
                    4.1.2.1.2. ERRC File
                        4.1.2.1.2.1. 6 comp files for each axis
                            4.1.2.1.2.1.1. XLIN, XPTC, XYAW, XROL, XINY, XINZ
                            4.1.2.1.2.1.2. YLIN, YPTC, YYAW, YROL, YINX, YINZ
                            4.1.2.1.2.1.3. ZLIN, ZPTC, ZYAW, ZROL, ZINX, ZINY
                        4.1.2.1.2.2. Additional files to keep
                            4.1.2.1.2.2.1. Laserdat.prg, XYZ.DAT, ZCRS.DAT, XXXMMA.DAT, SQR.DAT
            4.1.3. Copy files from flash drive onto laptop into proper location
            4.1.4. Plug machine network cable into laptop
            4.1.5. Open Camio and test online connection
        4.2. Delete all sensors and default IJK for head
            4.2.1. Delete sensors
                4.2.1.1. Go online
                4.2.1.2. In Camio -> machine tab -> view all 
                4.2.1.3. Delete all sensors under each category
            4.2.2. Default IJKs
                4.2.2.1. In Camio -> Camio options -> CMM Configuration
                4.2.2.2. Select Probe Head Tab
                4.2.2.3. Select CMM Type Drop Down Selection, Select Same CMM Type as was Set to before
            4.2.3. Close Camio and Launch Again
            4.2.4. Go online
            4.2.5. Select calibrate head procedure and follow steps
            4.2.6. Note probe length
            4.2.7. Close Camio and Launch again
        4.3. Open & Run FS_BB.Dmi Program
            4.3.1. Squareness check = No
            4.3.2. Calibrate Sensors = Yes
                4.3.2.1. Input sensor and sphere data
                4.3.2.2. Position sphere in Z+ direction (Horizontal arm is different)
            4.3.3. Collect Before Volumetric Data Following Prompts in program
                4.3.3.1. Write results on paper or sticky note in case of lost data
                4.3.3.2. Volumetric pattern to be followed
                4.3.3.3. Low sphere is always master
                4.3.3.4. Examples of proper Clearance positions
            4.3.4. Calculate before Volumetric spread
                4.3.4.1. Difference between highest & Lowest numbers
            4.3.5. Select Exit Program in Ballbar Selection Window
            4.3.6. Finish program following prompts
            4.3.7. Rename Results
                4.3.7.1. Located in C:\Caliprogs\Results
                4.3.7.2. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’B4_B89 Volumetric.TXT’’
        4.4. Open & Run B89_Rep.Dmi Program
            4.4.1. Enter Information prompted
            4.4.2. Take Touch on Sphere Z+
            4.4.3. Hit Man Print
            4.4.4. Finish program following Prompts
            4.4.5. Close Camio
            4.4.6. Rename Results
                4.4.6.1. Located in C:\Caliprogs\Results
                4.4.6.2. Calculate repeat spread for each axis
                    4.4.6.2.1. Difference between highest and lowest numbers 
                4.4.6.3. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’B4_B89 Repeat.TXT’’
        4.5. Any Before Data out of tolerance
            4.5.1. Notify Client
    5. Machine PM 
        5.1. Machine PM only includes Machine cleaning, minor adjustments (Such as timing belts) and noting of issues found. Does not allow us to perform repairs
        5.2. Remove All machine covers
        5.3. Open PM Form, complete all tasks Listed on form
        5.4. Inform Client of any issues found during PM 
            5.4.1. Drive alignments
            5.4.2. Air system contamination
            5.4.3. Damaged Cabling
            5.4.4. Worn components
            5.4.5. Other issues outside of normal machine condition
        5.5. If any repairs or parts are needed
            5.5.1. Inform client & Office
            5.5.2. Regardless of office directive do not complete any work outside of job requirements unless additional hours is approved in writing by client
                5.5.2.1. Notify wwcsi management of problems encountered and current status
        5.6. Upon completion reinstall machine covers
        5.7. Complete machine servo tuning using proper overseer for machine controller
            5.7.1. Overseer 2000 – LK 2000 With Serial Coms
            5.7.2. Blue Swirl Overseer – Network comms LK 2000, MCC200, MCC250
            5.7.3. Overseer NMC – NMC 100, NMC 300
        5.8. Re-boot Controller
        5.9.  Open & Run B89_Rep.Dmi Program in Camio
            5.9.1. Enter Information prompted
            5.9.2. Take Touch on Sphere Z+
            5.9.3. Hit Man Print
            5.9.4. Open Real Time Scope
                5.9.4.1. Select machine IP Address in Drop Down Menu (Typically 212.240.51.91)
                5.9.4.2. Hit Connect
                5.9.4.3. Select Check Box Show gains control
                5.9.4.4. Fine tune each axis by doing the following for each (Start with X, Then Y, Finally Z)
                    5.9.4.4.1. Select Position Error in Selection Window 1, adjust division to 10um per Division
                    5.9.4.4.2. Select Velocity Demand in Selection Window 2
                    5.9.4.4.3. Hit Start
                    5.9.4.4.4. Select axis you are watching in gains control sidebar
                    5.9.4.4.5. Adjust machine Proportional gain to minimize Position error
                        5.9.4.4.5.1. Do not adjust outside of 5-30 range
                    5.9.4.4.6. Adjust divisions to fit error onto screen
                    5.9.4.4.7. Position error of 5um on a bridge is acceptable during a touch, 1-2um is ideal
                    5.9.4.4.8. Only check position error value when axis is moving for touch not standing still
                    5.9.4.4.9. Move to next axis when position error is minimized
                    5.9.4.4.10. If satisfactory adjustment is unachievable check tuning in overseer
            5.9.5. If Repeat program finishes while adjusting, select run test again
            5.9.6. Close Camio
        5.10. Square PH10
            5.10.1. Delete all sensors and default IJK for head
                5.10.1.1. Delete sensors
                    5.10.1.1.1. Go online
                    5.10.1.1.2. In Camio -> machine tab -> view all 
                    5.10.1.1.3. Delete all sensors under each category
                5.10.1.2. Default IJKs
                    5.10.1.2.1. In Camio -> Camio options -> CMM Configuration
                    5.10.1.2.2. Select Probe Head Tab
                    5.10.1.2.3. Select CMM Type Drop Down Selection, Select Same CMM Type as was Set to before
                5.10.1.3. Close Camio
            5.10.2. Launch Caliprogs Application
            5.10.3. OK -> OK -> C:/ -> Program Files -> Nikon -> Camio72
            5.10.4. Select Camio72u.exe From Window on Right
            5.10.5. Set Probe Type and Machine Type Then Press OK
            5.10.6. Delete Caliprogs Sensors
                5.10.6.1. Tools -> Delete Sensors -> OK
            5.10.7. Launch Square Renishaw PH Program
                5.10.7.1. Follow Steps in Program
                5.10.7.2. If you have No AM1 or AM2 Installed Rotation is only error you can correct
                    5.10.7.2.1. Once X number of 90 90 angle is correct close program and move on
                5.10.7.3. If you have AM1 or AM2 Run program until all 4 outputs are green 
            5.10.8. Upon completion of square head program verify by running again
    6. After Repeat
        6.1. Open Camio
            6.1.1. Go online
            6.1.2. Select calibrate head procedure and follow steps
            6.1.3. Note probe length
        6.2. Close and reopen Camio
        6.3. Open & Run FS_BB.Dmi Program
            6.3.1. Squareness check = No
            6.3.2. Calibrate Sensors = Yes
                6.3.2.1. Input sensor and sphere data
                6.3.2.2. Position sphere in Z+ direction (Horizontal arm is different)
                6.3.2.3. Complete sensor calibration
            6.3.3. Close Program
        6.4. Open & Run B89_Rep.Dmi Program
            6.4.1. Enter Information prompted
            6.4.2. Take Touch on Sphere Z+
            6.4.3. Hit Man Print
            6.4.4. Finish program following Prompts
            6.4.5. Close Camio
            6.4.6. Rename Results
                6.4.6.1. Located in C:\Caliprogs\Results
                6.4.6.2. Calculate repeat spread for each axis
                    6.4.6.2.1. Difference between highest and lowest numbers 
                6.4.6.3. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’B4_B89 Repeat.TXT’’
        6.5. If Results within spec Move Forward, If not Take Corrective action
            6.5.1. Inform wwcsi management of issues
    7. Laser Data
        7.1. Open Camio
            7.1.1. Camio options -> Cmm configuration -> Variables 
            7.1.2. Select Default from Dropdown menu
            7.1.3. Set IFQTIM Variable working & Default to 0
        7.2. Close Camio
        7.3. Setup laser equipment
            7.3.1. Plug laser in and preheat 
            7.3.2. Connect air temp and material temp sensors to environment sensor, place within machine volume
            7.3.3. Connect all required comms cables to both laptops
                7.3.3.1. Ensure laptop to laptop comms cable is attached to com port 1 on both laptops
            7.3.4. Attach laser post to PAA1 (there are rare exceptions) 
                7.3.4.1. Attach linear reflector to laser post
            7.3.5. Setup linear inferometer in desired configuration
            7.3.6. Open laserdata program for laser laptop
        7.4. Open Camio
            7.4.1. Run laser.dmi
                7.4.1.1. Auto data collection = Yes (usually)
                7.4.1.2. Laser com port = 1
                7.4.1.3. Ensure clearance for automatic movement
            7.4.2. Mark map origin on table
        7.5. Align laser shot ( tips are meant to be advice not strict guidelines, develop your own technique as needed)
            7.5.1. Initial setup
                7.5.1.1. The closer this setup is the faster alignment will go
                7.5.1.2. Align reflector to be parallel to axis you are going to collect linear data from
                7.5.1.3. Setup laser on whichever base you chose, ensure it is stable
                    7.5.1.3.1. Be careful when using tripod of AVMs & flexible floor grates etc as this will make data collection extremely difficult
                7.5.1.4. Ensure laser is level both directions, as you adjust shot, keep roll level but disregard pitch level
            7.5.2. Alignment techniques vary
                7.5.2.1. 2 types of linear shots 
                    7.5.2.1.1. Straight shots 
                        7.5.2.1.1.1. Move laser linearly – up/down, right/left when reflector and laser are close together
                        7.5.2.1.1.2. Move laser angularly – pitch & Yaw when reflector is far from laser
                    7.5.2.1.2. 90 Shots
                        7.5.2.1.2.1. Align inferometer to make both dots overlap when reflector is close to laser
                        7.5.2.1.2.2. Inferometer must be normal (near perfectly aligned to) to reflector
                        7.5.2.1.2.3. Only move laser when reflector is far away to realign dots, move inferometer when close
            7.5.3. Use Camio to move machine from end to end of shot while aligning
            7.5.4. Goal is 100% Beam strength full travel
        7.6. Setup laser data 
            7.6.1. Set scale C of E 
                7.6.1.1. Renishaw gold scale – 5.5
                7.6.1.2. Renishaw Tonic / Silver – cant remember whoever is reading this remind me 11 something
            7.6.2. Set shot type to linear
            7.6.3. Set averaging to short term
                7.6.3.1. If you have issues with laser count not settling, you can use long term 
            7.6.4. Hit zero to get laser count to come up in window, when laser is counting move on 
        7.7. In camio hit cancel to confirm laser alignment is complete
            7.7.1. Confirm prompt information
            7.7.2. Confirm count direction matches from laser DRO to CMM DRO, if not change in laser data
            7.7.3. Offset laser DRO to match CMM when prompted
            7.7.4. Set wait time to default
            7.7.5. Select linear for shot type
            7.7.6. While machine is collecting data ensure both DROs are settling before data is collected
                7.7.6.1. If not confirm 
                    7.7.6.1.1. IFQTM is set to 0
                    7.7.6.1.2. Wait time is 6 seconds
                    7.7.6.1.3. Adjust machine speed knob to a lower setting 50% or less
                    7.7.6.1.4. Machine is repeatable within reason
                        7.7.6.1.4.1. If issue persists inform wwcsi management
            7.7.7. If machine stays in place and will not move on with collection make sure DROs match
                7.7.7.1. If they are not within 1mm machine will be caught in loop
                7.7.7.2. Caused by wrong sign direction usually
        7.8. Collect one run of before linear data
            7.8.1. File located in Errc Folder
            7.8.2. Calculate linear deviation
                7.8.2.1. Spread from highest number to lowest number as long as data runs through zero
                7.8.2.2. If data does not run through zero, result is equal to largest deviation from zero
                    7.8.2.2.1. EX- Linear results max -    .0024mm      min -     -.0013mm   = .0037 spread
                    7.8.2.2.2. EX- Linear results max -    .0024mm      min -     .0013mm   = .0024 spread
                    7.8.2.2.3. EX- Linear results max -    -.0124mm      min -     -.0113mm   = .0124 spread
                7.8.2.3. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’B4_*LIN1.Dat’’
                    7.8.2.3.1. * is Axis that you shot   EX Xlin1.dat  Ylin1.dat  Zlin1.dat
            7.8.3. Turn off error correction in camio
                7.8.3.1. Camio options -> CMM Configuration -> Error correction
                7.8.3.2. Change to none, apply & OK
                7.8.3.3. Close camio
        7.9. Collect raw runs
            7.9.1. Reopen camio
                7.9.1.1. Open laser program, complete laser alignment again if necessary 
                7.9.1.2. Ensure laser data configurations are still correct
                7.9.1.3. Collect two runs of linear data for the axis you are working on
                7.9.1.4. Open and view raw data files from errc folder, if data correlates move on, if not collect more runs.
            7.9.2. Turn on error correction in camio
                7.9.2.1. Camio options -> CMM Configuration -> Error correction
                7.9.2.2. Change to software, apply & OK
                7.9.2.3. Close camio
            7.9.3. Open Vecpd 
                7.9.3.1. Run option 2 to zero out *lin file for axis you are shooting
                    7.9.3.1.1. All other options ensure you enter N to not zero files
                7.9.3.2. Run option 4 after you created a zero file 
                    7.9.3.2.1. Select the lin file you want to recreate
                    7.9.3.2.2. Enter A for average
                    7.9.3.2.3. Enter the number of *lin.dat files you want vecpd to average, = number of raw data runs you saved
                7.9.3.3. Run option 4 again
                    7.9.3.3.1. View data and look for any spikes in data you can massage out by manually editing cells, be careful with this as you can easily be over zealous
                7.9.3.4. Run option 4 one more time
                    7.9.3.4.1. Enter 40 for Squareness and scale factoring, if any scale factoring numbers are not set to default (1.000000) manually set them to default value 
        7.10. After linear data 
            7.10.1. Open camio
                7.10.1.1. Open laser program, complete laser alignment again if necessary 
                7.10.1.2. Ensure laser data configurations are still correct
                7.10.1.3. Collect one run of linear data for the axis you are working on
            7.10.2. Calculate linear deviation
                7.10.2.1. Refer to above description
                7.10.2.2. If deviation exceeds Before deviation or machine spec contact wwcsi management
                7.10.2.3. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’AF_*LIN1.Dat’’
        7.11. Clean all Laser components and replace neatly into case, reinstall Probe assembally
        7.12. Set IFQTM back to as found value NOT ZERO
    8. Squareness & Scale factoring
        8.1. Delete all sensors 
            8.1.1. Delete sensors
                8.1.1.1. Go online
                8.1.1.2. In Camio -> machine tab -> view all 
                8.1.1.3. Delete all sensors under each category
        8.2. Open & Run FS_BB.Dmi Program
            8.2.1. Squareness check = Yes
            8.2.2. Calibrate Sensors = Yes
                8.2.2.1. Input sensor and sphere data
                8.2.2.2. Position sphere in Z+ direction (Horizontal arm is different)
            8.2.3. Collect squareness Data Following Prompts in program
                8.2.3.1. 3 Squareness planes
                    8.2.3.1.1. XY
                    8.2.3.1.2. YZ
                    8.2.3.1.3. ZX
                8.2.3.2. Measure Squareness at map origin if possible or as close as possible
                8.2.3.3. At least 2 runs per position, if not repeatable do more
                8.2.3.4. Write results on paper or sticky note in case of lost data
                    8.2.3.4.1. Keep track of L1 & L2 By Noting axis alignments and bar positioning
                    8.2.3.4.2. Keep track of Vecpd Squareness comp values
            8.2.4. Collect data, if results exceed 1.5 arcsec 
                8.2.4.1. Close camio
                8.2.4.2. go to vecpd
                    8.2.4.2.1. option 7 
                        8.2.4.2.1.1. follow prompts, pick Squareness
                        8.2.4.2.1.2. enter L1 & L2 in proper orientation
                        8.2.4.2.1.3. write down new Squareness comp values
                8.2.4.3. open camio & run again until results under 1.5 arcsec is achieved, multiple iterations can be required
                    8.2.4.3.1. remember that you must close camio anytime you want to change values as it will not update error comp until you open camio again
            8.2.5. once all 3 planes are square within 1.5 arcsec move onto next step
        8.3. Scale Factoring
            8.3.1. Open & Run FS_BB.Dmi Program
                8.3.1.1. Squareness check = No
                8.3.1.2. Calibrate Sensors = No
            8.3.2. Scale factoring ensures all 3 axis linearly match up
                8.3.2.1. Measure ball bar straight in each axis
                8.3.2.2. Multiple runs required for each position, if not repeatable run more
                8.3.2.3. Note measurement results on paper
            8.3.3. Determine average number to scale to
                8.3.3.1. If all 3 axis match up well skip scale factoring and move to after Volumetric
                8.3.3.2. If 2 axis match up scale 3rd to match
                8.3.3.3. If none match up typically scale to middle average but it varies greatly and relies on judgment to determine optimal value
                    8.3.3.3.1. EX   X 701.0000   Y 701.1000   Z 701.1050
                        8.3.3.3.1.1. Y & Z nearly match so scale X to match the average of Y & Z (701.1025)
                    8.3.3.3.2. EX X 701.0000 Y 701.1000 Z 701.2000
                        8.3.3.3.2.1. None match up so you must make best guess based on the data you have seen from specific machine, best starting point would be to scale both X & Z to match Y Axis (701.1000) but could highly vary and will come with experience
            8.3.4. Go to Vecpd
                8.3.4.1. Option 7
                    8.3.4.1.1. Select scale factoring
                    8.3.4.1.2. Pick axis you are applying scaling to
                    8.3.4.1.3. Enter average number you are scaling axis to (calibrated length)
                    8.3.4.1.4. Enter measured result for axis
            8.3.5. Open camio
                8.3.5.1. Verify measurement of any axis you applied scaling to.
                    8.3.5.1.1. Measurement should be near average, acceptable value depends on machine specs
                        8.3.5.1.1.1. If vol is 15um or less - ~ 5um
                        8.3.5.1.1.2. If vol is greater than 15 um - ~10um
    9. After Volumetric
        9.1. Delete all sensors and default IJK for head
            9.1.1. Delete sensors
                9.1.1.1. Go online
                9.1.1.2. In Camio -> machine tab -> view all 
                9.1.1.3. Delete all sensors under each category
            9.1.2. Default IJKs
                9.1.2.1. In Camio -> Camio options -> CMM Configuration
                9.1.2.2. Select Probe Head Tab
                9.1.2.3. Select CMM Type Drop Down Selection, Select Same CMM Type as was Set to before
            9.1.3. Close Camio and Launch Again
            9.1.4. Go online
            9.1.5. Select calibrate head procedure and follow steps
            9.1.6. Note probe length
            9.1.7. Close Camio and Launch again
        9.2. Open & Run FS_BB.Dmi Program
            9.2.1. Squareness check = No
            9.2.2. Calibrate Sensors = Yes
                9.2.2.1. Input sensor and sphere data
                9.2.2.2. Position sphere in Z+ direction (Horizontal arm is different)
            9.2.3. Collect After Volumetric Data Following Prompts in program
                9.2.3.1. Write results on paper or sticky note in case of lost data
                9.2.3.2. Volumetric pattern to be followed
                9.2.3.3. Low sphere is always master
                9.2.3.4. Examples of proper Clearance positions
            9.2.4. Calculate After Volumetric spread
                9.2.4.1. Difference between highest & Lowest numbers
            9.2.5. Select Exit Program in Ballbar Selection Window
            9.2.6. Finish program following prompts
            9.2.7. Rename Results
                9.2.7.1. Located in C:\Caliprogs\Results
                9.2.7.2. ALWAYS RENAME FILE BEFORE PROCEEDING ‘’AF_B89 Volumetric.TXT’’
    10. Release to customer
        10.1. Copy any modified files from Errc folder on laptop to Flashdrive & Customer pc 
        10.2. Hand modify customer CMMCFG Folder to reflect any changes made to File on laptop
        10.3. Reinstall customer probing onto machine
            10.3.1. Follow procedure to zero IJK Values and set them using customer PC, in Camio 8 you must hand modify Value to default within cmmcfg file
        10.4. Realign any tool racks on machine
            10.4.1. Directly before releasing to customer save new copy of Cmmcfg onto flashdrive to ensure best backup data and seamless transfer incase data loss for customer
        10.5. Observe customer tip qualification and at least one part measurement before leaving site
        10.6. Address any machine issues observed with customer if not already addressed
        10.7. Complete Calibration form, PM Form, and backup data & Service report
            10.7.1. Backup data folder will contain 	
                10.7.1.1. Results folder containing
                    10.7.1.1.1. 5 Before data files
                    10.7.1.1.2. 5 After data files
                10.7.1.2. Errc folder 
                    10.7.1.2.1. Exact copy of Errc from flashdrive containing all newly modified files
                10.7.1.3. Cmmcfg folder
                    10.7.1.3.1. Exact copy of Cmmcfg from flashdrive containing all newly modified files
        10.8. Get Service Report signed, pack tools and leave site
        10.9. Email in all paperwork before Sunday lunchtime the week the work it pertains to was completed.
            10.9.1. Paperwork is processed on a first come first serve basis, the earlier the better.





