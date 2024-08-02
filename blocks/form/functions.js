/**
 * Get Full Name
 * @name getFullName Concats first name and last name
 * @param {string} firstname in Stringformat
 * @param {string} lastname in Stringformat
 * @return {string}
 */
function getFullName(firstname, lastname) {
  return `${firstname} ${lastname}`.trim();
}

/**
 * Calculate the number of days between two dates.
 * @param {*} endDate
 * @param {*} startDate
 * @returns {number} returns the number of days between two dates
 */
function days(endDate, startDate) {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  // return zero if dates are valid
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  const diffInMs = Math.abs(end.getTime() - start.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

/**
 * For generateUniqueID
 * @retrun {string}
 */
function generateUniqueID () {
    var d = new Date();
    var time = d.getTime();
    return time;
}

/**
 * getURL_Parameter
 * @return {string}
 */
function getURL_Parameter () {  
  if (typeof window === "undefined") {
    return ''; // Return empty string if window is undefined
  }
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
     if(urlParams.has('generatedID')){
         var generatedID = urlParams.get('generatedID');
         return generatedID;
    } 
    return '';
 }

/**
 * getEighteenYearsAgoDate
 * @retrun {Date}
 */
function getEighteenYearsAgoDate () {   // ootb not implemented as date functions not available replaced by date picker and used max , min dates 
    const today = new Date();
    const pastDate = new Date(today.setFullYear(today.getFullYear() - 18));
    return pastDate.toISOString().split('T')[0]; // format to YYYY-MM-DD
} 

// eslint-disable-next-line import/prefer-default-export
export { getFullName, days, generateUniqueID, getURL_Parameter, getEighteenYearsAgoDate };
