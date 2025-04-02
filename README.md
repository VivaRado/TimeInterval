## **Preface**

**TimeInterval** is an Open Source project of **VivaRado**.

<div markdown='1' class="header_logo">

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_logo.svg)

</div>

<div markdown='1' class="header_preview">

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_preview.svg)

</div>



 
##  **Introduction**

The **TimeInterval** interface aims to simplify the process of date and time selection, and offer more granularity in formatting.


#### Contributors:

*  VivaRado <support@vivarado.com>
*  Andreas Kalpakidis
*  Madina Akhmatova

---

### **Profile**
<sub>Introduction / Profile</sub>

<br>


*   Company: VivaRado LLP
*   Designer: Andreas Kalpakidis
*   Management: Madina Akhmatova


---


### **Project Overview**
<sub>Introduction / Project Overview</sub>

<br>


*   Project Name: TimeInterval
*   Code Name: tintvl
*   Proposal Date: 01/04/2025

---

### **Design**



The source consists of **TimeInterval**, **DateFormatParse**, **Assertions** and **Utils**.

---

### **Interface**
<sub>Design / Interface</sub>

<br>


We simplify the process of time selection by offering multi input methods. You can input the time directly to the main input fields or adjust the units in a dropdown. Navigation is made easy via keyboard arrows that allow for quick adjustments. We offer assertions to maintain the validity of date input, may that be in the main input field or the time unit input fields in the dropdown. Labels simplify the process, by informing the user for the name of the day and month, in a compact fashion.

#### Day Month Year:

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_preview.svg)

#### Month Year:

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_preview_my.svg)

#### Twelve hour clock:

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_preview_hma.svg)

#### Twenty-four hour clock:

![Screenshot](https://github.com/VivaRado/TimeInterval/raw/main/_README/assets/media/time_interval_preview_hm.svg)

---

### **Composition**
<sub>Design / Interface / Composition</sub>

<br>


The ```src``` contains **ESM** (ECMAScript modules) only for the JS, the structural CSS is located in the ```src/timeinterval.css``` file, and the thematic CSS in ```src/theme.css```, you can do without the thematic, or roll your own.

---

### **TimeInterval**
<sub>Design / Interface / TimeInterval</sub>

<br>


ABC

---

### **Usage**
<sub>Design / Interface / TimeInterval / Usage</sub>

<br>


Initiating the TimeInterval user interface by including the TimeInterval class to your page, or by importing it in a script:

<br>

```
<script src="./src/timeinterval.esm.js" type="module"></script>
```
```
import {TimeInterval} from './src/timeinterval.esm.js'
```

---

### **Parameters**
<sub>Design / Interface / TimeInterval / Parameters</sub>

<br>



Pass the parameters object when initiating a new class.

```
var element = document.querySelector(".timeinterval")
var parameters = {
	format: "HH:mm",
	start_time: "22:21",
	range: true,
	ast_intvl: true,
	ast_value: true,
	ast_silent: false
}
new TimeInterval(element, parameters);
```

---

#### Parameter Overview

A description of each parameter:

<br>

**format** [ String ]
> 
> Provide the date format string, supported formats: ```'HH:mm'``` ```'hh:mm a'``` ```'MM/yyyy'``` ```'dd/MM/yyyy'``` ```'dd/mm'```

<br>

**start\_time** [ String ]
> 
> A string representation of a date, adhering to the provided **format**, used as an initiation time.

<br>

**range** [ Bool ]
> 
> Show range button. If range is not needed, provide only one HTML input field and set to **range**:**false**.

<br>

**ast\_intvl** [ Bool ]
> 
> Assert interval difference. Asserts if the first input field date occurrence preceeds the second.

<br>

**ast\_value** [ Bool ]
> 
> Assert date value. Asserts the quality of provided date representation strings.

<br>

**ast\_silent** [ Bool ]
> 
> Assertions still happen unless turned off above (**ast\_intvl**, **ast\_value**), but will be silenced and there will be no error reporting on the client.

<br>

**upstream\_input** [ Bool ]
> 
> Prevent wrapped input fields being editable.

<br>

**labels** [ Bool ]
> 
> Show labels for time units.

<br>

**aware\_label** [ Bool ]
> 
> Show the name of days and months, inplace of generic labels, where applicable. Requires **labels**:**true**. Labels come from ```./src/dfp.js``` specific variables ```_days, _mths```.

<br>

**labels\_days** [ Array ]
> 
> You can provide an array of day names for localisation.

<br>

**labels\_mths** [ Array ]
> 
> You can provide an array of month names for localisation.

<br>

**keyboard\_arrow** [ Bool ]
> 
> Allow usage of keyboard arrows for, input selection and value input.

---

### **Adjustments**
<sub>Design / Interface / TimeInterval / Adjustments</sub>

<br>



The ```./src/timeinterval.css``` contains settings for various parts of the appearance of the wrapper dropdown:

<br>

```
:root {
  --trwd: 5rem;    /* width of time_input controllers inside the wrap */
  --trpd: 0.5rem;  /* space between time_input controllers */
  --trwp: 1rem;    /* padding around wrap */
}
```



---

### **Interactivity**
<sub>Design / Interface / TimeInterval / Interactivity</sub>

<br>



An overview of interface interactivity.

---

#### Keyboard Controls

Left and Right to select wrapper input field, top and bottom to increase and decrease value.

>```⮜``` Navigate to the left wrapped input.
>
>```⮞``` Navigate to the right wrapped input.
>
>```⮝``` Increase value of current wrapped input.
>
>```⮟``` Decrease value of current wrapped input.


---

#### Desired Behaviours

* Click on main input field should show the dropdown wrapper.
* Input of appropriatelly formated date should update the value.
* Input of appropriate date into wrapper input fields should update the input value, and upstream to the main input field.
* Left Click on the up and down arrows should update the input value, and upstream to the main input field.
* Left Click and hold should increment value in the input field and upstream to the main input field on release.
* Right Click on the up and down arrows is dissabled.
* Click anywhere other than the main input field or active wrapper should close any active wrappers.
* Pressing the Escape key, while on main input field focus, should close any active wrappers.
* Left and Right keyboard arrows should select wrapper input fields.
* Tab and Shift Tab should select wrapper input fields.
* Up and Down keyboard arrows should increase and decrease the wrapper input field value, and upstream to the main input field.
* Click on Range Toggle button should bring in the second main input field.



---

### **Functions**
<sub>Design / Interface / TimeInterval / Functions</sub>

<br>


Here is an overview of the **TimeInterval** function(s):

<br>

**constructor** ( ```trg```, ```cfg``` )
> param **trg**: Element or Nodelist<br>
> param **cfg**: Object (Parameters) <br>
> 
> ---
> 
> Initiates building of the interface, initiates interactivity listeners, provides data structures and defaults.  

<br>

**build** ( ```element```, ```inx``` )
> param **element**: Element <br>
> param **inx**: Integer Index <br>
> 
> ---
> 
> Formulates the HTML around the targeted elements. Provides access to public functions ( ```hide```, ```show```, ```setDate``` )

<br>

**getControlInput** ( ```element``` )
> param **element**: Element <br>
> 
> ---
> 
> updates: ```this.ctpi``` with Element<br>
> 
> ---
> 
> Updates ```this.ctpi``` holding current interacted wrapper input element.

<br>

**clearClass** ( ```cls``` )
> param **cls**: String (class without dot) <br>
> 
> ---
> 
> Removes class from elements with given class ```cls```.

<br>

**calendarDays** ()
> 
> returns: Integer number of days in month.<br>
> 
>

<br>

**isSubseq** ( ```el_inp``` )
> param **el_inp**: Element <br>
> 
> ---
> 
> returns: Bool <br>
> 
> ---
> 
> Returns true if main input provided is subsequent, false if it is the first.

<br>

**controlsShow** ( ```el``` )
> param **el**: Element <br>
> 
> ---
> 
> Show wrapper controls dropdown.

<br>

**controlsHide** ( ```el``` )
> param **el**: Element <br>
> 
> ---
> 
> Hide wrapper controls dropdown.

<br>

**padValue** ( ```sym```, ```el``` )
> param **sym**: String Token [ ye, mo, da, ho, mn, se, ml, me ]<br>
> param **el**: Element <br>
> 
> ---
> 
> returns: String <br>
> 
> ---
> 
> Pads integer value with zeros based on the unit symbol.

<br>

**determineValue** ( ```tx``` )
> param **tx**: String Set Token [ ye\_tx, mo\_tx, da\_tx, ho\_tx, mn\_tx, se\_tx, ml\_tx, me\_tx ]<br>
> 
> ---
> 
> returns: String <br>
> 
> ---
> 
> Returns padded value given set token.


<br>

**dateContract** ( ```frm``` )
> param **frm**: String Specification Format <br>
> 
> ---
>
> Turn Date Object ```this.prm.dto``` to Date String given Spec. Format.

<br>

**dateExpand** ( ```date_string``` )
> param **date_string**: String Representation of Date<br>
> 
> ---
> 
> returns: String <br>
> 
> ---
> 
>  Turn Date String to Date Object ```this.prm.dto```.

<br>

**calcDate** ( ```dir``` )
> param **dir**: String [prev, next, none]<br>
> 
> ---
> 
> updates: ```this.prm.dto[tkn]``` <br>
> 
> ---
> 
>  Calculates increase or decrease of date unit (tkn) of active wrapper input field, given direction.

<br>

**populateWrapperInputs** ()
> 
>  Adds ```this.prm.dto``` values to wrapper inputs according to their tokens.

<br>

**dateDisplay** ()
> 
>  Displays ```this.prm.dto``` date to main inputs and wrapper inputs.

<br>

**assertDateTokens** ()
> 
>
>  Asserts all ```activeTokens``` of given wrapper inputs, for valid date values.

<br>

**resolveDate** ( ```start_time```, ```target```, ```stream```, ```direction``` )
> param **start_time**: String Representation of Date.<br>
> param **target**: Element.<br>
> param **stream**: String [upstream, downstream, direct].<br>
> param **direction**: String [prev, next, none]<br>
> 
> ---
> 
> Main function used to resolve the date.
>

```
A1.  Define dtstr with start_time if that is available, 
     if not and input is empty, define it with the current time, 
     otherwise leave the current value.
A2.  Assert date uniformity, the values provided are checked, 
     for exceeding max allowed unit length.
A3.  Date is expanded from string to object.
A4.  Date is calculated, increased, decreased or left as is.
A5.  Every token in the date object is asserted separatelly. 
     See assertion functions for assertDate.
A6.  Update this.prev_val with valid value.
A7.  Contract date to string.
A8.  Assert range if range assertion conditions are met.
A9.  Display date on main input field and wrapper input fields.
A10. Return all assertion messages if not silenced.
``` 	 

<br>

**startTimeInterval** ( ```e``` , ```date_string```, ```stream```)
> 
> param **e**: Event<br>
> param **date_string**: String Representation of Date.<br>
> param **stream**: String [upstream, downstream, direct].<br>
> 
> ---
>
>  Event function, for date change interaction requests.

<br>

**arrowSelect** ( ```e```, ```dir``` )
> 
> param **e**: Event.<br>
> param **dir**: String [left, right]. <br>
> 
> ---
>
>  Picks wrapper input on left or right keyboard arrow press.

<br>

**onHold** ( ```self```, ```e``` )
> 
> param **self**: this.<br>
> param **e**: Event.<br>
> 
> ---
>
>  Event function, for when press and hold event (keyboard or press) is requested, initiates timeouts and intervals.

<br>

**onRelease** ( ```self```, ```e``` )
> 
> param **self**: this.<br>
> param **e**: Event.<br>
> 
> ---
>
>  Event function, for when release event (keyboard or press) is requested, clears timeouts and intervals.

<br>

**awareLabelUpdate** ( ```tgt``` )
> 
> param **tgt**: Element.<br>
> 
> ---
>
>  Updates labels with day name and month name, where applicable.

<br>

**wrapperInput** ( ```tgt``` , ```sym``` )
> 
> param **tgt**: Element.<br>
> param **sym**: String Token [ ye, mo, da, ho, mn, se, ml, me ].<br>
> 
> ---
>
>  Event function, for date change interaction requests coming from wrapper inputs.

<br>

**interact** ( ```elem``` )
> 
> param **elem**: Element.<br>
> 
> ---
>
>Set Events on main and subsequent inputs, wrapper inputs and wrapper control arrows.
>

```
B1.  Show Controls on click or focus on main inputs.
B2.  Set Events on wrapper input arrows.
B3.  Dissavle context menu on arrows.
B4.  Initiate onHold on mousedown.
B5.  Initiate onRelease on mouseup.
B6.  On mouse leave reset holdActive and timeouts.
B7.  On focus send main input value downstream,
     to wrapper inputs.
B8.  Store the value in prev_val for restoration,
     in case of failed assertions.
B9.  Backspace and Delete
B10. On enter key assume client requests value update, 
     initiate downstream.
B11. On escape assume clients requests cancelation, hide wrapper.
B12. On change of the values of the wrapper inputs, 
     initiates wrapperInput, otherwise leave initial value.
B13. On focus et active class on wrapper input.
B14. Sanitize input to numpad numbers, number keys, 
     dissalow characters, allow ctrl or meta, 
     ignore backspace, delete, and left right arrows.
B15. Keyboard arrow navigation.
```

<br>


---

### **Substructure**
<sub>Design / Substructure</sub>

<br>


The interface is supported with **dateformatparse** for date parsing/formatting and **assertions** for date uniformity and validity.

---

### **DateFormatParse**
<sub>Design / Substructure / DateFormatParse</sub>

<br>


For reasons of self containment we provide the **DateFormatParse**. This could be substituted by another, more comprehensive date parsing and formatting library.

---

### **Usage**
<sub>Design / Substructure / DateFormatParse / Usage</sub>

<br>


Used in **TimeInterval** to Format and Parse:

```
"HH:mm"          // 22:16
"hh:mm a"        // 10:16 PM
"MM/yyyy"        // 07/2025
"dd/MM/yyyy"     // 02/07/2025
"dd/mm"          // 02/07
```

<br>

Standard Behaviour:

```	
formatDate( "MMM dd, yyyy", new Date()   ) // returns string
parseDate ( "05/12/2450"  , "MM/dd/yyyy" ) // returns date object

"h:mm a"                       // 8:46 PM
"MM/dd/yyyy"                   // 02/17/2020
"MMM dd, yyyy"                 // Feb 17, 2020
"EEE, MMM d, ''yy"             // Mon, Feb 17, '20
"hh 'o''clock' a, X"           // 08 o'clock PM, -0600
"yyyyMMdd'T'HHmmssXX"          // 20200217T204746-0600
"yyyy-MM-dd'T'HH:mm:ssXXXX"    // 2020-02-17T20:47:46-06:00
"hh 'o''clock' a, zzzz"        // 12 o'clock PM, Pacific Daylight Time

"O"        // GMT-8
"OOOO"     // GMT-08:00 
"x"        // -08 		// +00 if offset is zero
"xx"       // -0800 	// <<
"xxx"      // -08:00 	// <<
"xxxx"     // -0800 	// <<
"xxxxx"    // -08:00 	// <<
"X"        // -08 		// "Z" if offset is zero
"XX"       // -0800 	// <<
"XXX"      // -08:00 	// <<
"XXXX"     // -0800 	// <<
"XXXXX"    // -08:00 	// <<
"zzzz"     // Pacific Standard Time
```


---

### **Functions**
<sub>Design / Substructure / DateFormatParse / Functions</sub>

<br>


Here is an overview of the **Reports** functions:

<br>

**_TZ** ( ```date```, ```symb``` )
> param **date**: Date Object. <br>
> param **symb**: Number. <br>
> 
> ---
> 
>  Display strength value on strength bar as percentage.

<br>

**_h** ( ```res```, ```mtl``` )
> param **res**: Integer, Value Length.<br>
> param **mtl**: Integer, Match Length. <br>
> 
> ---
> 
>  Parse Hours

<br>

**_a** ( ```res```, ```mtl``` )
> param **res**: Integer, Value Length.<br>
> param **mtl**: Integer, Match Length. <br>
> 
> ---
> 
>  Parse Meridiem

<br>

**_M** ( ```res```, ```mtl``` )
> param **res**: Integer. Value Length<br>
> param **mtl**: Integer. Match Length<br>
> 
> ---
> 
>  Parse Month

<br>

**_E** ( ```res```, ```mtl``` )
> param **res**: Integer, Value Length.<br>
> param **mtl**: Integer, Match Length. <br>
> 
> ---
> 
>  Parse Day Name

<br>

**replaceCoverage** ( ```fStr```, ```iArr``` )
> param **fStr**: String Date format. <br>
> param **iArr**: Array Matches. <br>
> 
> ---
> 
>  Display feedback as alerts.

<br>

**pads** ( ```str```, ```mt``` )
> param **str**: String. <br>
> param **mt**: Integer. <br>
> 
> ---
> 
>  Pad str by mt.

<br>

**kfn** ( ```mtc```, ```kwds```, ```rk``` = false )
> param **mtc**: matches Array. <br>
> param **kwds**: **keywords** Object. <br>
> param **rk**: Boolean. <br>
> 
> ---
> 
>  Keyword Object retrieval.

<br>


**formatDate** ( ```fStr```, ```dObj``` )
> param **fStr**: String Date format. <br>
> param **dObj**: Date Object. <br>
> 
> ---
> 
>  Format a Date Object according to a Date format string.

<br>

**assertDateUniform** ( ```dStr```, ```fStr``` )
> param **dStr**: String Representation of Date. <br>
> param **fStr**: String Date format. <br>
> 
> ---
> 
> returns: Bool. <br>
>
> ---
> 
>  Assert date string uniformity by comparing the maximum length of all matched symbols from the **fStr**, with the length of the provided **dStr**, ignoring non relevant characters.

<br>

**parseDate** ( ```dStr```, ```fStr```, ```obj``` )
> param **dStr**: String Representation of Date. <br>
> param **fStr**: String Date format. <br>
> param **obj**: Bool. <br>
> 
> ---
> 
> returns: **Date Object** if **obj** is **false**. <br>
> returns: **dto Object** if **obj** is **true**. <br>
>
> ---
> 
>  Parse a date string given format. Return Date Object or dto Object.

<br>

**calcUnit** ( ```date```, ```unit```, ```quant``` )
> param **date**: Date Object. <br>
> param **unit**: String [days, minutes]. <br>
> param **quant**: Number. <br>
> 
> ---
> 
>  Rudamentary unit calculation on Date Object.



---

### **Assertions**
<sub>Design / Substructure / Assertions</sub>

<br>


Contains the ```assertRange``` and ```assertDate``` main assertions for TimeInterval.

---

### **Functions**
<sub>Design / Substructure / Assertions / Functions</sub>

<br>


Here is an overview of the **Assertion** functions:

<br>

**assertRange** ( ```timeinterval```, ```cnav```, ```subseq``` )
> param **timeinterval**: TimeInterval Class Instance <br>
> param **cnav**: Element <br>
> param **subseq**: Bool <br>
> 
> ---
>
> Returns: Object { verdict: Bool, messages: Array }
>
> ---
> 
>  Assert if applicable, for the main input elements, that the subsequent input element, does not contain a time value smaller or equal to the first input element.

<br>

**assertDate** ( ```timeinterval```, ```date_str```, ```sym``` )
> param **timeinterval**: TimeInterval Class Instance <br>
> param **date_str**: String Representation of Date<br>
> param **sym**: String [ ye, mo, da, ho, mn, se, ml, me ] <br>
> 
> ---
>
> Returns: Object { verdict: Bool, messages: Array }
>
> ---
>
> Assert date for various conditions.
> 

```
C1.  Assert the a date string being parseable, 
C2.  Assert the symbol of a date string for maximum digit length 
     and maximum unit length - if day calculate max days in month, 
C3.  Assert for minimum year, 
C4.  Assert for value overflow at 24 hours, 
     Assert for value overflow at 60 minutes.
```

---


### **Production**



To work on extending this module a few things are provided:

Run in browser with reload allong with gulp watch:

```
npm run dev
```

<br>

Just build with gulp

```
npm run build
```

<br>

Test the server side functions

```
npm run test
```


---

### **Installation**



**TimeInterval** does not have any dependencies, other than those for development (--save-dev).

You could substiture date parsing and formatting with a more complete, library.

To install:

```
npm install
```

---

### **Glossary**



**ye**: year.<br>
**mo**: month.<br>
**da**: day.<br>
**ho**: hour.<br>
**mn**: minute.<br>
**se**: second.<br>
**ml**: millisecond.<br>
**me**: meridiem.<br>
**nm**: name month.<br>
**nd**: name day.<br>


---


### **Reference**



N/A

---
