function setRow(type, ...a) {
    
    let output = '<tr>';
    
    if (type === 0) {
        for (let i=0; i<a.length; i++) { output += '<th class="col'+i+'">'+a[i]+'</th>'; }
    } else {
        for (let i=0; i<a.length; i++) { output += '<td class="col'+i+'">'+a[i]+'</td>'; }
    }
    
    output += '</tr>';
    
    return output;
}

function showData(path) {
    fetch(path)
    .then(response => response.text())
    .then(data => {
        
        let aData = data.split('\n');
        let aKeys = aData.length-2;
        
        let output = '<table id="covid-table" class="display">';
        
        output += '<thead>';
        output += setRow(0, 'Place', 'Confirmed', 'Infected %', 'Deaths', 'Deaths %', 'Recovered', 'Recovered %');
        output += '</thead>';
        
        output += '</tbody>';
        for (let k=1; k < aKeys; k++) {
            
            let row = aData[k].split(',');
            
            let col0 = row[0]+', '+row[1];
            let col1 = (row[5] !== '') ? row[5] : '-';
            let col2 = (row[11] !== '') ? ((row[5]/row[11])*100).toFixed(2) : '-';
            let col3 = (row[6] !== '') ? row[6] : '-';
            let col4 = (parseInt(row[5]) !== 0) ? ((row[6]/row[5]) * 100).toFixed(2) : 0;
            let col5 = (row[7] !== '') ? row[7] : '-';
            let col6 = (parseInt(row[5]) !== 0) ? ((row[7]/row[5]) * 100).toFixed(2) : 0;
            
            output += setRow(1, col0, col1, col2, col3, col4, col5, col6); 
        } 
        
        output += '</tbody>';
        output += '</table>';
        
        document.getElementById("US").innerHTML = output;
        
        // show the table
        $(document).ready( function () {
            let gTable = $('#covid-table').DataTable( {
                order: [4, 'dsc'],
                "orderClasses": true,
                responsive: true,
                "pageLength": 100
            } );
            new $.fn.dataTable.FixedHeader( gTable );
        });
    });
}


let dir = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/';
    dir += 'csse_covid_19_data/csse_covid_19_daily_reports_us/';

let d = new Date(); 

let dM = (d.getMonth()+1).toString();
let dD = (d.getDate()-1).toString();
let dY = (d.getFullYear()).toString();

if (dM.length < 2) { dM = '0' + dM; }
if (dD.length < 2) { dD = '0' + dD; }

let status = dM+'-'+dD+'-'+dY;
let lastfile = status+'.csv';
    
let http = new XMLHttpRequest();
http.open('get', dir+lastfile, true);
http.onreadystatechange = () => {
    if (http.readyState === 4) {
        if ( (http.status == 200) || (http.status == 0) ) {
            status = dM+'-'+dD+'-'+dY;
            lastfile = status+'.csv';
        } else {
            status = '05-18-2020';
            lastfile = status+'.csv';
            return;
        }
    }
}
http.send(null);

document.getElementById("STATUS").innerHTML = 'Last update: '+status;

showData(dir+lastfile);
