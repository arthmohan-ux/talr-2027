/*
  Form reference data, shared by every TA Dialogues form on this site.
  Plain-text tables, compiled to arrays when the page loads. No JSON files, no fetch.

  IND       18 canonical industries, keyed 1..18. "Other" is added by the form and opens a text field.
            GCC is deliberately not an industry: it is an operating model. Wells Fargo India is BFSI and a GCC.
  RAW       curated companies as "Name|industryCode". HR product companies sit under HR Tech (3), never with
            staffing firms (4). Corrections go in form-overrides.js, not here, so this table stays clean.
  ST        state code to full name. INTL holds the international hubs for GCC-side attendees.
  CITY_RAW  cities as "Name|StateCode|alias;alias". Neighbourhoods are aliases of their parent city.
  HUBS      cities that win ties and cross a rank boundary in the City search.
*/
(function () {
  var IND = ["IT Services", "SaaS & Software Products", "HR Tech", "Staffing & HR Services", "BFSI", "Fintech", "Consulting & Professional Services", "Manufacturing & Industrial", "Automotive", "Healthcare & Pharma", "Retail & E-commerce", "FMCG & Consumer Goods", "Telecom & Media", "Energy & Utilities", "Logistics & Mobility", "Travel & Hospitality", "Education & EdTech", "Government & Non-profit"];

  var RAW = `
TCS|1
Infosys|1
Wipro|1
HCLTech|1
Tech Mahindra|1
LTIMindtree|1
Cognizant|1
Accenture|1
Capgemini|1
IBM|1
DXC Technology|1
NTT DATA|1
Mphasis|1
Persistent Systems|1
Coforge|1
Hexaware|1
Zensar|1
Birlasoft|1
Cyient|1
Sonata Software|1
Mastek|1
KPIT Technologies|1
L&T Technology Services|1
Tata Elxsi|1
Virtusa|1
Brillio|1
Apexon|1
Innova Solutions|1
UST|1
Happiest Minds|1
Mindtree|1
Infogain|1
Nagarro|1
EPAM Systems|1
Globant|1
Thoughtworks|1
Publicis Sapient|1
Valtech|1
Synechron|1
Sigmoid|1
Tiger Analytics|1
TheMathCompany|1
Fractal Analytics|1
Mu Sigma|1
LatentView Analytics|1
Course5 Intelligence|1
Quess IT|1
Genpact|1
WNS|1
Concentrix|1
Firstsource|1
TaskUs|1
eClerx|1
HGS|1
Sagility|1
Teleperformance|1
Startek|1
iEnergizer|1
Atos|1
Kyndryl|1
Unisys|1
CGI|1
Fujitsu|1
NEC|1
Hitachi Vantara|1
Ness Digital Engineering|1
GlobalLogic|1
Altimetrik|1
Quest Global|1
Tata Technologies|1
Sasken|1
Mindsprint|1
Movate|1
Encora|1
Emids|1
CitiusTech|1
Robosoft Technologies|1
Spanidea|1
Flentas|1
Accorian|1
Astuto|1
Sequantix|1
Parkar|1
NIIT Technologies|1
3i Infotech|1
Ramco Systems|1
Intellect Design Arena|1
Nucleus Software|1
Newgen Software|1
Sify Technologies|1
Datamatics|1
Ugam|1
Kantar Analytics|1
ITC Infotech|1
Infosys BPM|1
TCS iON|1
HCL Infosystems|1
Tata Communications Transformation|1
Indegene|1
R Systems|1
Xoriant|1
Saama|1
Prodapt|1
Aspire Systems|1
Photon|1
Kellton|1
Trigent|1
Bahwan CyberTek|1
Hinduja Global Solutions|1
Conduent|1
Alorica|1
Brainvire|1
Mobiquity|1
Ideas2IT|1
Cloudthat|1
Searce|1
Rackspace|1
Microsoft|2
Google|2
Amazon|2
Oracle|2
SAP|2
Salesforce|2
Adobe|2
Intuit|2
Atlassian|2
ServiceNow|2
Workday|2
VMware|2
Broadcom|2
Cisco|2
Zoom|2
Zscaler|2
Reltio|2
Xperi|2
TiVo|2
Ellucian|2
Blue Yonder|2
Dassault Systemes|2
Autodesk|2
PTC|2
Siemens EDA|2
Synopsys|2
Cadence|2
Freshworks|2
Zoho|2
Chargebee|2
Postman|2
BrowserStack|2
Druva|2
Icertis|2
Innovaccer|2
Mindtickle|2
Whatfix|2
CleverTap|2
MoEngage|2
WebEngage|2
Exotel|2
Kovai.co|2
Hasura|2
Sprinklr|2
Uniphore|2
Gupshup|2
Yellow.ai|2
Haptik|2
LeadSquared|2
Capillary Technologies|2
Zenoti|2
Highradius|2
Rubrik|2
Nutanix|2
NetApp|2
Commvault|2
Veritas|2
Citrix|2
Red Hat|2
MongoDB|2
Snowflake|2
Databricks|2
Confluent|2
Elastic|2
Okta|2
Palo Alto Networks|2
Fortinet|2
Check Point|2
CrowdStrike|2
Akamai|2
Cloudflare|2
F5|2
Juniper Networks|2
Arista Networks|2
Barracuda Networks|2
McAfee|2
Trellix|2
Gen Digital|2
Sophos|2
Qualys|2
Tenable|2
Splunk|2
New Relic|2
Dynatrace|2
Datadog|2
Twilio|2
Freshdesk|2
HubSpot|2
Zendesk|2
DocuSign|2
Dropbox|2
Box|2
Slack|2
Figma|2
Canva|2
Miro|2
LinkedIn|2
Meta|2
Apple|2
Netflix|2
Expedia|16
Booking Holdings|16
Sabre|16
Amadeus|16
Thomson Reuters|2
Wolters Kluwer|2
RELX|2
Elsevier|2
Gartner|2
Experian|2
TransUnion|2
Equifax|2
Dun & Bradstreet|2
Moody's Analytics|2
S&P Global|2
MSCI|2
FactSet|2
Bloomberg|2
Near|2
Rakuten|2
Gojek|2
Grab|2
InMobi|2
Glance|2
Dailyhunt|2
ShareChat|2
Ather Software|2
Tekion|2
Securonix|2
Sumo Logic|2
Infoblox|2
Gainsight|2
Zeta|2
Juspay|2
Vymo|2
SirionLabs|2
Signzy|2
Perfios|2
Lentra|2
Hevo Data|2
Leena AI|2
Observe.AI|2
Ozonetel|2
Verloop|2
Kissflow|2
Zluri|2
Rocketlane|2
Fyle|2
Amagi|2
Toast|2
Intercom|2
Pega|2
Pegasystems|2
Informatica|2
Teradata|2
Qlik|2
Tableau|2
Alteryx|2
Infor|2
Epicor|2
Sage|2
Unit4|2
Kronos|2
UKG|2
ADP|2
Ceridian|2
Paychex|2
Workato|2
Celonis|2
UiPath|2
Automation Anywhere|2
Appian|2
OutSystems|2
Mendix|2
Siemens Digital Industries Software|2
Ansys|2
Hexagon|2
Bentley Systems|2
Trimble|2
Esri|2
Nvidia|2
Electronic Arts|2
Ubisoft|2
Zynga|2
Games24x7|2
Dream11|2
MPL|2
Nazara|2
Wildlife Studios|2
Darwinbox|3
Keka|3
greytHR|3
HackerRank|3
HackerEarth|3
Eightfold|3
Phenom|3
iCIMS|3
SmartRecruiters|3
Greenhouse|3
Lever|3
Workable|3
Beamery|3
SeekOut|3
HireVue|3
Mettl|3
Mercer Mettl|3
iMocha|3
Talview|3
Xobin|3
DoSelect|3
Glider.ai|3
Param.ai|3
Hyreo|3
RippleHire|3
Ceipal|3
Visume|3
AiRoHire|3
HireWithLumi|3
Callify.ai|3
Skillenza|3
Unstop|3
Superhire|3
Kaamwork|3
Recruiterflow|3
Zoho Recruit|3
Freshteam|3
Springworks|3
Vantage Circle|3
Empuls|3
Zimyo|3
sumHR|3
PeopleStrong|3
Sense|3
Paradox|3
Textio|3
Indeed|3
Naukri|3
Info Edge|3
Foundit|3
Monster|3
Glassdoor|3
Apna|3
WorkIndia|3
Instahyre|3
Cutshort|3
Hirist|3
iimjobs|3
Wellfound|3
LinkedIn Talent Solutions|3
Thomas|3
Thomas International|3
SHL|3
Aon Assessment|3
Wheebox|3
Pymetrics|3
Harver|3
Codility|3
CodeSignal|3
Hirepro|3
Recruit CRM|3
Zwayam|3
Recruitee|3
Jobvite|3
JazzHR|3
BambooHR|3
Rippling|3
Deel|3
Remote.com|3
Oyster HR|3
Multiplier|3
Shenzyn|3
iGauge|3
Randstad|4
Adecco|4
ManpowerGroup|4
Kelly Services|4
TeamLease|4
Quess Corp|4
CIEL HR|4
Xpheno|4
Michael Page|4
Hays|4
Robert Half|4
Korn Ferry|4
Spencer Stuart|4
Egon Zehnder|4
Heidrick & Struggles|4
Russell Reynolds|4
ABC Consultants|4
Antal International|4
Allegis Group|4
TEKsystems|4
Aerotek|4
Collabera|4
Careernet|4
Taggd|4
Peepal Consulting|4
Recruitment Bricks|4
Maneshala|4
Hudson RPO|4
Cielo|4
Alexander Mann Solutions|4
PeopleScout|4
Kenexa|4
Genius Consultants|4
Allegis Global Solutions|4
Talent500|4
Ikya|4
BGS Global|4
Innovsource|4
Vahura|4
ANSR|4
Inductus|4
Zyoin|4
Mafoi|4
Volt Consulting|4
Experis|4
Pontoon Solutions|4
Kforce|4
Insight Global|4
Harvey Nash|4
Signium|4
Stanton Chase|4
Transearch|4
Odgers Berndtson|4
Boyden|4
Accord Group|4
HSBC|5
Standard Chartered|5
Citi|5
JPMorgan Chase|5
Goldman Sachs|5
Morgan Stanley|5
Barclays|5
Deutsche Bank|5
BNP Paribas|5
Societe Generale|5
Natixis|5
Credit Suisse|5
UBS|5
Wells Fargo|5
Bank of America|5
Capital One|5
American Express|5
ANZ|5
NatWest Group|5
Lloyds Banking Group|5
Santander|5
ING|5
ABN AMRO|5
Nomura|5
Mizuho|5
MUFG|5
Sumitomo Mitsui|5
DBS Bank|5
OCBC|5
UOB|5
Maybank|5
HDFC Bank|5
ICICI Bank|5
Axis Bank|5
Kotak Mahindra Bank|5
State Bank of India|5
Bank of Baroda|5
IndusInd Bank|5
Yes Bank|5
IDFC First Bank|5
Federal Bank|5
RBL Bank|5
Bandhan Bank|5
AU Small Finance Bank|5
Allstate|5
Swiss Re|5
Munich Re|5
AXA|5
Allianz|5
Prudential|5
MetLife|5
Aviva|5
Zurich Insurance|5
Chubb|5
AIG|5
Liberty Mutual|5
Travelers|5
Hartford|5
Lincoln Financial|5
Principal Financial|5
Manulife|5
Sun Life|5
Fidelity Investments|5
Vanguard|5
BlackRock|5
State Street|5
Northern Trust|5
BNY Mellon|5
Invesco|5
Franklin Templeton|5
T. Rowe Price|5
Schwab|5
Synchrony|5
Discover Financial|5
First Citizens India|5
Fifth Third|5
PNC|5
US Bank|5
Truist|5
KeyBank|5
Citizens Financial|5
Ally|5
Macquarie|5
Commonwealth Bank|5
Westpac|5
NAB|5
HDFC Life|5
ICICI Prudential|5
SBI Life|5
Max Life Insurance|5
Bajaj Allianz|5
Bajaj Finserv|5
Bajaj Finance|5
Tata AIG|5
Tata Capital|5
Aditya Birla Capital|5
L&T Finance|5
Shriram Finance|5
Mahindra Finance|5
Muthoot Finance|5
Manappuram Finance|5
HDFC AMC|5
Nippon India Mutual Fund|5
Edelweiss|5
Motilal Oswal|5
Kotak Securities|5
Angel One|5
Zerodha|5
Groww|5
Upstox|5
Delta Capita|5
Standard Bank|5
The Standard|5
LSEG|5
London Stock Exchange Group|5
NSE|5
BSE|5
CRISIL|5
ICRA|5
CARE Ratings|5
Fitch|5
Moody's|5
Broadridge|5
SS&C Technologies|5
Fiserv|5
FIS|5
Global Payments|5
Jack Henry|5
Temenos|5
Finastra|5
Calypso|5
Murex|5
Arcesium|5
DE Shaw|5
Tower Research|5
Optiver|5
Jane Street|5
Citadel|5
Two Sigma|5
WorldQuant|5
Graviton|5
Quadeye|5
AlphaGrep|5
Star Health|5
Niva Bupa|5
Care Health Insurance|5
Go Digit|5
Acko|5
Policybazaar|5
ICICI Lombard|5
New India Assurance|5
LIC|5
Better|6
PayPal|6
Visa|6
Mastercard|6
Paytm|6
PhonePe|6
Razorpay|6
Cred|6
BharatPe|6
Pine Labs|6
Cashfree|6
PayU|6
MobiKwik|6
Lendingkart|6
Slice|6
Jupiter|6
Fi Money|6
Navi|6
KreditBee|6
Moneyview|6
M2P Fintech|6
Open|6
Paisabazaar|6
BankBazaar|6
InCred|6
Ummeed|6
TerraPay|6
Wise|6
Revolut|6
Stripe|6
Adyen|6
Klarna|6
Block|6
Coinbase|6
CoinDCX|6
CoinSwitch|6
Ebix|6
Mswipe|6
Ezetap|6
Setu|6
Decentro|6
Yubi|6
CredAvenue|6
Kissht|6
Rupeek|6
ZestMoney|6
Simpl|6
LazyPay|6
OneCard|6
Uni Cards|6
smallcase|6
Scripbox|6
INDmoney|6
ET Money|6
Vested|6
Aspire|6
Brex|6
Ramp|6
Vervent|6
Deloitte|7
EY|7
KPMG|7
PwC|7
McKinsey|7
BCG|7
Bain & Company|7
Kearney|7
Oliver Wyman|7
Roland Berger|7
Alvarez & Marsal|7
FTI Consulting|7
Grant Thornton|7
BDO|7
RSM|7
Withum|7
Protiviti|7
Marsh|7
Aon|7
Willis Towers Watson|7
WTW|7
Mercer|7
Gallagher|7
Duff & Phelps|7
Kroll|7
Crowe|7
Baker McKenzie|7
Cyril Amarchand Mangaldas|7
AZB & Partners|7
Khaitan & Co|7
Shardul Amarchand Mangaldas|7
Trilegal|7
JSA|7
Nishith Desai Associates|7
Dentsu|7
WPP|7
Publicis Groupe|7
Omnicom|7
IPG Mediabrands|7
Havas|7
GroupM|7
Ogilvy|7
Edelman|7
Nielsen|7
Ipsos|7
Kantar|7
ZS Associates|7
Axtria|7
Evalueserve|7
Copal Amba|7
Acuity Knowledge Partners|7
Smart Cube|7
Consero|7
Pink Lemonade|7
Everest Group|7
ISG|7
Zinnov|7
Avasant|7
Forrester|7
IDC|7
Frost & Sullivan|7
Sattva|7
Dalberg|7
PA Consulting|7
Capco|7
Synpulse|7
Deloitte USI|7
EY GDS|7
KPMG Global Services|7
PwC AC|7
Siemens|8
Bosch Global Software|8
ABB|8
Schneider Electric|8
Honeywell|8
GE Aerospace|8
GE Vernova|8
GE HealthCare Technologies|8
Emerson|8
Rockwell Automation|8
Johnson Controls|8
Trane|8
Carrier|8
Daikin|8
Otis|8
Eaton|8
Cummins|8
Caterpillar|8
John Deere|8
CNH Industrial|8
Larsen & Toubro|8
Tata Steel|8
JSW Steel|8
Hindalco|8
Vedanta|8
Aditya Birla Group|8
Grasim|8
UltraTech Cement|8
Ambuja Cements|8
ACC|8
Asian Paints|8
Berger Paints|8
Pidilite|8
Havells|8
Polycab|8
Crompton|8
Bajaj Electricals|8
Godrej & Boyce|8
Thermax|8
Kirloskar|8
Bharat Forge|8
BHEL|8
Hindustan Aeronautics|8
Bharat Electronics|8
Boeing|8
Airbus|8
Rolls-Royce|8
Safran|8
Collins Aerospace|8
Lockheed Martin|8
Honeywell Aerospace|8
Applied Materials|8
Lam Research|8
KLA|8
ASML|8
Intel|8
AMD|8
Qualcomm|8
Texas Instruments|8
Micron|8
Western Digital|8
Seagate|8
Samsung Semiconductor|8
NXP|8
Infineon|8
STMicroelectronics|8
Analog Devices|8
Marvell|8
Microchip|8
Renesas|8
Silicon Labs|8
GlobalFoundries|8
Astera Labs|8
Tata Electronics|8
MediaTek|8
Arm|8
Synaptics|8
Lenovo|8
HP|8
Dell Technologies|8
HPE|8
Foxconn|8
Dixon Technologies|8
Wistron|8
Flex|8
Jabil|8
Sanmina|8
3M|8
Saint-Gobain|8
Dow|8
BASF|8
DuPont|8
Linde|8
Air Liquide|8
Henkel|8
Covestro|8
Evonik|8
UPL|8
SRF|8
Aarti Industries|8
Deepak Nitrite|8
Tata Chemicals|8
Reliance Industries|8
Bloom Energy|14
Cargill|12
Olam|12
Bunge|12
ADM|12
Wildcraft|11
DigiKey|8
Avnet|8
Arrow Electronics|8
Mouser|8
Hitachi|8
Toshiba|8
Panasonic|8
LG Electronics|8
Samsung|8
Sony|8
Philips|8
Whirlpool|8
Voltas|8
Blue Star|8
Grundfos|8
Atlas Copco|8
Sandvik|8
SKF|8
Timken|8
Alstom|8
Wabtec|8
Kone|8
Schindler|8
Mitsubishi Electric|8
Yokogawa|8
Endress+Hauser|8
Festo|8
Danfoss|8
Volvo Group|8
Daimler Truck|8
Bosch|9
Tata Motors|9
Mahindra & Mahindra|9
Maruti Suzuki|9
Hyundai|9
Kia|9
Toyota Kirloskar|9
Honda|9
Hero MotoCorp|9
Bajaj Auto|9
TVS Motor|9
Royal Enfield|9
Eicher Motors|9
Ashok Leyland|9
Ola Electric|9
Ather Energy|9
Mercedes-Benz R&D India|9
BMW|9
Volkswagen|9
Skoda|9
Renault Nissan|9
Stellantis|9
Ford|9
General Motors|9
Tesla|9
Rivian|9
Continental|9
ZF|9
Valeo|9
Magna|9
Aptiv|9
Visteon|9
Harman|9
Denso|9
Lear|9
Faurecia|9
Forvia|9
Minda Industries|9
Uno Minda|9
Motherson|9
Sona Comstar|9
MRF|9
Apollo Tyres|9
CEAT|9
JK Tyre|9
Bridgestone|9
Michelin|9
Goodyear|9
Escorts Kubota|9
ALD Automotive|9
Ayvens|9
Hyundai Mobis|9
Tata AutoComp|9
Rane Group|9
Endurance Technologies|9
Schaeffler|9
Mahle|9
Daimler India Commercial Vehicles|9
Volvo Eicher|9
Abbott|10
Biocon|10
Biocon Biologics|10
Syngene|10
Sun Pharma|10
Dr. Reddy's|10
Cipla|10
Lupin|10
Aurobindo Pharma|10
Zydus Lifesciences|10
Glenmark|10
Torrent Pharma|10
Alkem|10
Mankind Pharma|10
Intas|10
Divi's Laboratories|10
Novartis|10
Pfizer|10
GSK|10
Sanofi|10
AstraZeneca|10
Merck|10
MSD|10
Johnson & Johnson|10
Roche|10
Bayer|10
Boehringer Ingelheim|10
Novo Nordisk|10
Eli Lilly|10
Amgen|10
Gilead|10
Takeda|10
Astellas|10
Daiichi Sankyo|10
Viatris|10
Teva|10
Medtronic|10
Siemens Healthineers|10
GE HealthCare|10
Philips Healthcare|10
Stryker|10
Boston Scientific|10
Becton Dickinson|10
BD|10
Baxter|10
Thermo Fisher Scientific|10
Danaher|10
Agilent|10
Waters|10
PerkinElmer|10
Revvity|10
IQVIA|10
Parexel|10
ICON|10
Syneos Health|10
PPD|10
Labcorp|10
Quest Diagnostics|10
Dr. Lal PathLabs|10
Metropolis|10
Apollo Hospitals|10
Fortis Healthcare|10
Manipal Hospitals|10
Narayana Health|10
Max Healthcare|10
Aster DM|10
Medanta|10
Cloudnine|10
Practo|10
Pharmeasy|10
1mg|10
Tata 1mg|10
Netmeds|10
Medibuddy|10
HealthifyMe|10
Cult.fit|10
Optum|10
UnitedHealth Group|10
Elevance Health|10
Cigna|10
Evernorth|10
CVS Health|10
Humana|10
Centene|10
McKesson|10
Cardinal Health|10
Cerner|10
Oracle Health|10
Epic Systems|10
athenahealth|10
Change Healthcare|10
R1 RCM|10
Omega Healthcare|10
AGS Health|10
Access Healthcare|10
GeBBS|10
Elanco|10
Zoetis|10
Babylon|10
Molina Healthcare|10
Walgreens Boots Alliance|10
Lonza|10
Piramal Pharma|10
Jubilant|10
Granules|10
Natco|10
Ipca|10
Wockhardt|10
Walmart|11
Flipkart|11
Amazon India|11
Myntra|11
Meesho|11
Nykaa|11
Reliance Retail|11
Tata Digital|11
Tata Neu|11
Tata CLiQ|11
Croma|11
bigbasket|11
Blinkit|11
Zepto|11
Swiggy Instamart|11
JioMart|11
DMart|11
Avenue Supermarts|11
Trent|11
Westside|11
Zudio|11
Shoppers Stop|11
Lifestyle|11
Landmark Group|11
Future Group|11
Spencer's|11
More Retail|11
Lenskart|11
FirstCry|11
Pepperfry|11
Urban Ladder|11
IKEA|11
Decathlon|11
H&M|11
Zara|11
Inditex|11
Uniqlo|11
Target|11
Tesco|11
Sainsbury's|11
Marks & Spencer|11
Lowe's|11
Home Depot|11
Kroger|11
Costco|11
Best Buy|11
Macy's|11
Nordstrom|11
Gap|11
Levi Strauss|11
Nike|11
Adidas|11
Puma|11
Skechers|11
Bata|11
Titan Company|11
Tanishq|11
CaratLane|11
Kalyan Jewellers|11
Malabar Gold|11
7-Eleven|11
Ahold Delhaize|11
Carrefour|11
Lulu Group|11
Majid Al Futtaim|11
eBay|11
Etsy|11
Wayfair|11
Shopify|11
Zalando|11
Ajio|11
Purplle|11
Mamaearth|11
Honasa Consumer|11
Boat|11
Sugar Cosmetics|11
Licious|11
Country Delight|11
Bewakoof|11
Snapdeal|11
ShopClues|11
Udaan|11
Jumbotail|11
Dunzo|11
Zomato|11
Swiggy|11
Eternal|11
Hindustan Unilever|12
Unilever|12
Procter & Gamble|12
P&G|12
Nestle|12
ITC|12
Dabur|12
Marico|12
Godrej Consumer Products|12
Emami|12
Colgate-Palmolive|12
Britannia|12
Parle|12
Haldiram's|12
PepsiCo|12
Coca-Cola|12
Mondelez|12
Mars|12
Kellogg's|12
Kraft Heinz|12
General Mills|12
Danone|12
Reckitt|12
Kimberly-Clark|12
Johnson & Johnson Consumer|12
Kenvue|12
L'Oreal|12
Estee Lauder|12
Diageo|12
Pernod Ricard|12
AB InBev|12
Heineken|12
United Spirits|12
United Breweries|12
Carlsberg|12
Bacardi|12
Tata Consumer Products|12
Amul|12
Mother Dairy|12
Nestle India|12
Wipro Consumer Care|12
Jyothy Labs|12
Bajaj Consumer|12
Hershey|12
Ferrero|12
McCain|12
Cadbury|12
Red Bull|12
Philip Morris|12
British American Tobacco|12
Jubilant FoodWorks|12
Domino's|12
McDonald's|12
Starbucks|12
Tata Starbucks|12
Burger King|12
KFC|12
Yum Brands|12
Westlife Foodworld|12
Devyani International|12
Sapphire Foods|12
Varun Beverages|12
Hatsun Agro|12
Patanjali|12
Himalaya Wellness|12
Zydus Wellness|12
Ericsson|13
Nokia|13
Telstra|13
BT Group|13
Vodafone|13
Vodafone Idea|13
Airtel|13
Bharti Airtel|13
Jio|13
Reliance Jio|13
Tata Communications|13
Tata Play|13
Verizon|13
AT&T|13
T-Mobile|13
Comcast|13
Charter Communications|13
Lumen|13
Lumen Technologies|13
Orange|13
Deutsche Telekom|13
Telefonica|13
Singtel|13
NCS|13
Optus|13
Samsung Networks|13
Ciena|13
Infinera|13
Amdocs|13
Netcracker|13
Mavenir|13
Radisys|13
Sterlite Technologies|13
STL|13
Tejas Networks|13
HFCL|13
Indus Towers|13
Times Internet|13
Times of India Group|13
Network18|13
Viacom18|13
JioStar|13
Star India|13
Disney Star|13
Sony Pictures Networks|13
Zee Entertainment|13
Sun TV|13
Hindustan Times|13
The Hindu Group|13
Bennett Coleman|13
Dentsu Media|13
Warner Bros. Discovery|13
Paramount|13
Spotify|13
JioSaavn|13
Gaana|13
Pocket FM|13
Kuku FM|13
Pratilipi|13
YouTube|13
X|13
Snap|13
Pinterest|13
Reddit|13
MX Player|13
Amazon Prime Video|13
ZEE5|13
SonyLIV|13
Hotstar|13
Reliance Energy|14
Adani Group|14
Adani Green|14
Adani Ports|14
NTPC|14
Power Grid|14
Tata Power|14
JSW Energy|14
ReNew|14
Greenko|14
Avaada|14
Azure Power|14
Suzlon|14
Inox Wind|14
Siemens Energy|14
Shell|14
BP|14
ExxonMobil|14
Chevron|14
TotalEnergies|14
ONGC|14
Indian Oil|14
Bharat Petroleum|14
BPCL|14
HPCL|14
GAIL|14
Cairn Oil & Gas|14
Petronas|14
Saudi Aramco|14
ADNOC|14
Schlumberger|14
SLB|14
Halliburton|14
Baker Hughes|14
Weatherford|14
Enel|14
Engie|14
Iberdrola|14
National Grid|14
Duke Energy|14
Exelon|14
Hitachi Energy|14
Torrent Power|14
CESC|14
Waaree Energies|14
Vikram Solar|14
Sterling and Wilson|14
Hindustan Zinc|14
Coal India|14
NHPC|14
SJVN|14
Uber|15
Ola|15
Rapido|15
Lyft|15
Delhivery|15
Blue Dart|15
DHL|15
FedEx|15
UPS|15
Maersk|15
DP World|15
CMA CGM|15
MSC|15
Kuehne+Nagel|15
DB Schenker|15
DSV|15
Expeditors|15
C.H. Robinson|15
Mahindra Logistics|15
TCI|15
Gati|15
Ecom Express|15
Xpressbees|15
Shadowfax|15
Shiprocket|15
Porter|15
Rivigo|15
BlackBuck|15
Allcargo|15
Container Corporation of India|15
Indian Railways|15
Yulu|15
Bounce|15
Zoomcar|15
Revv|15
BluSmart|15
Vahan|15
LoadShare|15
Locus|15
FarEye|15
Ekart|15
Marriott|16
Hilton|16
Hyatt|16
IHG|16
Accor|16
Taj Hotels|16
IHCL|16
ITC Hotels|16
Oberoi Group|16
EIH|16
Leela Palaces|16
OYO|16
MakeMyTrip|16
Goibibo|16
Yatra|16
EaseMyTrip|16
Cleartrip|16
Ixigo|16
Thomas Cook|16
SOTC|16
Cox & Kings|16
Booking.com|16
Agoda|16
Airbnb|16
Expedia Group|16
Tripadvisor|16
Trivago|16
IndiGo|16
Air India|16
Vistara|16
SpiceJet|16
Akasa Air|16
Emirates|16
Qatar Airways|16
Etihad|16
Lufthansa|16
British Airways|16
Singapore Airlines|16
Delta Air Lines|16
United Airlines|16
American Airlines|16
Club Mahindra|16
Mahindra Holidays|16
Lemon Tree Hotels|16
Chalet Hotels|16
Radisson|16
Wyndham|16
Travelport|16
BCD Travel|16
American Express GBT|16
FCM Travel|16
redBus|16
AbhiBus|16
Treebo|16
FabHotels|16
Royal Caribbean|16
Carnival|16
BYJU'S|17
Unacademy|17
upGrad|17
Vedantu|17
Physics Wallah|17
Eruditus|17
Emeritus|17
Great Learning|17
Simplilearn|17
Scaler|17
InterviewBit|17
Coursera|17
Udemy|17
edX|17
Pearson|17
McGraw Hill|17
Wiley|17
Cengage|17
Chegg|17
Duolingo|17
Toppr|17
Testbook|17
Adda247|17
Classplus|17
Teachmint|17
LEAD School|17
Cuemath|17
WhiteHat Jr|17
Masai School|17
NIIT|17
Aptech|17
Manipal Education|17
Manipal Academy of Higher Education|17
Amity University|17
Symbiosis|17
Christ University|17
IIM Bangalore|17
IIM Ahmedabad|17
ISB|17
IIT Bombay|17
IIT Madras|17
IIT Delhi|17
BITS Pilani|17
Ashoka University|17
Shiv Nadar University|17
Jain University|17
VIT|17
SRM|17
Lovely Professional University|17
Anthology|17
Blackboard|17
Instructure|17
Turnitin|17
Kaplan|17
British Council|17
IDP Education|17
Skillsoft|17
Pluralsight|17
Government of India|18
NITI Aayog|18
Ministry of Electronics and IT|18
NASSCOM|18
CII|18
FICCI|18
ASSOCHAM|18
World Bank|18
IMF|18
United Nations|18
UNICEF|18
UNDP|18
WHO|18
Gates Foundation|18
Tata Trusts|18
Azim Premji Foundation|18
Infosys Foundation|18
Akshaya Patra|18
Teach For India|18
Pratham|18
CRY|18
Smile Foundation|18
Goonj|18
Give India|18
Save the Children|18
Oxfam|18
ActionAid|18
World Economic Forum|18
ISRO|18
DRDO|18
BARC|18
CSIR|18
Startup India|18
Invest India|18
KDEM|18
T-Hub|18
NSDC|18
Skill India|18
AIIMS|18
ICMR|18
RBI|18
SEBI|18
IRDAI|18
TRAI|18
NHAI|18
Indian Institute of Science|18
IISc|18
`;

  var ST_RAW = `
AN|Andaman and Nicobar Islands
AP|Andhra Pradesh
AR|Arunachal Pradesh
AS|Assam
BR|Bihar
CH|Chandigarh
CG|Chhattisgarh
DD|Dadra and Nagar Haveli and Daman and Diu
DL|Delhi
GA|Goa
GJ|Gujarat
HR|Haryana
HP|Himachal Pradesh
JK|Jammu and Kashmir
JH|Jharkhand
KA|Karnataka
KL|Kerala
LA|Ladakh
LD|Lakshadweep
MP|Madhya Pradesh
MH|Maharashtra
MN|Manipur
ML|Meghalaya
MZ|Mizoram
NL|Nagaland
OD|Odisha
PY|Puducherry
PB|Punjab
RJ|Rajasthan
SK|Sikkim
TN|Tamil Nadu
TS|Telangana
TR|Tripura
UP|Uttar Pradesh
UK|Uttarakhand
WB|West Bengal
INTL|International
`;

  var CITY_RAW = `
Mumbai|MH|Powai;Andheri;Bandra;BKC;Goregaon;Malad;Lower Parel;Worli;Vikhroli;Bombay;BOM
New Delhi|DL|Delhi;NCR;Rohini;Dwarka;Saket;Connaught Place;Okhla;Nehru Place;Aerocity;Delhi NCR
Bengaluru|KA|Whitefield;Electronic City;Koramangala;Indiranagar;HSR Layout;Marathahalli;Bellandur;Sarjapur;Yelahanka;Hebbal;Manyata;Outer Ring Road;Bangalore;Bengalooru;BLR
Hyderabad|TS|Gachibowli;HITEC City;Hitech City;Madhapur;Kondapur;Financial District;Secunderabad;Kukatpally;Cyberabad;HYD
Ahmedabad|GJ|Amdavad;GIFT City
Chennai|TN|Madras;OMR;Guindy;Sholinganallur;Perungudi;Tambaram;Taramani;Siruseri
Kolkata|WB|Salt Lake City;Salt Lake;Sector V;New Town;Rajarhat;Bidhannagar;Calcutta;Howrah
Surat|GJ|
Pune|MH|Hinjewadi;Kharadi;Magarpatta;Hadapsar;Viman Nagar;Baner;Wakad;Pimpri;Chinchwad;Pimpri-Chinchwad;Poona
Jaipur|RJ|
Kanpur|UP|Cawnpore
Navi Mumbai|MH|Vashi;Airoli;Belapur
Lucknow|UP|
Nagpur|MH|
Coimbatore|TN|Kovai
Indore|MP|Indaur
Thane|MH|Thana
Vadodara|GJ|Baroda
Bhopal|MP|
Rasapudipalem|AP|
Patna|BR|
Kallakurichi|TN|
Ludhiana|PB|
Nashik|MH|
Madurai|TN|
Tirunelveli|TN|
Agra|UP|
Faridabad|HR|
Rajkot|GJ|
Najafgarh|DL|
Jamshedpur|JH|
Gorakhpur|HR|
Kalyan|MH|
Dombivali|MH|
Meerut|UP|
Virar|MH|
Nowrangapur|OD|
Srinagar|JK|
Ghaziabad|UP|Indirapuram
Dhanbad|JH|
Aurangabad|MH|
Varanasi|UP|Banaras;Benares
Amritsar|PB|
Vijayawada|AP|
Ranchi|JH|
Jabalpur|MP|
Prayagraj|UP|Allahabad
Visakhapatnam|AP|Vizag
Jodhpur|RJ|
Gwalior|MP|
Teni|TN|
Raipur|CG|
Tiruchirappalli|TN|Trichy
Kota|RJ|
Shivaji Nagar|MH|
Sholapur|MH|
Chandigarh|CH|Tricity
Tiruppur|TN|
Guwahati|AS|
Hubballi|KA|Hubli;Dharwad;Hubli-Dharwad
Mysuru|KA|Mysore
Salem|TN|
Gurugram|HR|Gurgaon;Cyber City;Udyog Vihar;Golf Course Road;Sohna Road;Manesar
Bhubaneswar|OD|Bhubaneshwar
Bhiwandi|MH|
Jalandhar|PB|
Kanayannur|KL|
Bhayandar|MH|
Narela|DL|
Thiruvananthapuram|KL|Trivandrum;Technopark
Aligarh|UP|
Bareilly|UP|
Moradabad|UP|
Warangal|TS|
Dharavi|MH|
Gorakhpur|UP|
Guntur|AP|
Puducherry|PY|Pondicherry
Jajmau|UP|
Amravati|MH|
Bikaner|RJ|
Kochi|KL|Kakkanad;Infopark;Ernakulam;Cochin
Bhilai|CG|
Cuttack|OD|
Borivli|MH|
Bhavnagar|GJ|
Sangli|MH|
Jamnagar|GJ|
Jammu|JK|
Bokaro|JH|
Nanded|MH|
Kozhikode|KL|Calicut
Kolhapur|MH|
Nellore|AP|
Kalaburagi|KA|Gulbarga
Ajmer|RJ|
Dehradun|UK|
Erode|TN|
Durgapur|WB|
Ulhasnagar|MH|
Loni|UP|
Siliguri|WB|
Ujjain|MP|
Bilimora|GJ|
Karol Bagh|DL|
Asansol|WB|
Mangaluru|KA|Mangalore
Belagavi|KA|Belgaum
Saharanpur|UP|
Vellore|TN|
Bhatpara|WB|
Malegaon|MH|
Gaya|BR|
Ambattur|TN|
Jalgaon|MH|
Kurnool|AP|
Ramgundam|TS|
Udaipur|RJ|
Maheshtala|WB|
Patiala|PB|
Shyamnagar|WB|
Davangere|KA|
Akola|MH|
Rajpur Sonarpur|WB|
Korba|CG|
Jhansi|UP|
Thoothukudi|TN|Tuticorin
Ballari|KA|
Bhagalpur|BR|
Agartala|TR|
Kakinada|AP|
Latur|MH|
Panihati|WB|
Rajamahendravaram|AP|
Dhule|MH|
Rohtak|HR|
Ahilyanagar|MH|
Kollam|KL|
Bilaspur|CG|
Bhilwara|RJ|
Brahmapur|OD|
Muzaffarpur|BR|
Punasa|MP|
Muzaffarnagar|UP|
Avadi|TN|
Kadapa|AP|
Kamarhati|WB|
Mathura|UP|
Chanda|MH|
Vijayapura|KA|
Shivamogga|KA|Shimoga
Alwar|RJ|
Shahjanpur|UP|
Junagadh|GJ|
Thrissur|KL|
Nizamabad|TS|
Tumkur|KA|
Parbhani|MH|
Hisar|HR|
Firozabad|UP|
Kulti|WB|
Karnal|HR|
Barddhaman|WB|
Gundupalaiyam|PY|
Barasat|WB|
Mulugu|TS|
Bihar Sharif|BR|
Bali|WB|
Rampur|UP|
Darbhanga|BR|
Panipat|HR|
Tirupati|AP|
Greater Noida|UP|
Noida|UP|Noida Sector 62;Noida Expressway
Aizawl|MZ|
Gandhinagar|GJ|GIFT
Dindigul|TN|
Thanjavur|TN|
Karimnagar|TS|
Dewas|MP|
Sonipat|HR|
Ichalkaranji|MH|
Bathinda|PB|
Jalna|MH|
Kirari Sulemannagar|DL|
Satna|MP|
Purnia|BR|
Imphal|MN|
Saugor|MP|
Kushinagar|UP|
Rourkela|OD|
Durg|CG|
Anantapur|AP|
Ratlam|MP|
Ranipet|TN|
Lal Bahadur Nagar|TS|
Arrah|BR|
Baranagar|WB|
Gajuwaka|AP|
Etawah|UP|
Ambarnath|MH|
Naihati|WB|
Bharatpur|RJ|
Begusarai|BR|
Tiruvottiyur|TN|
Gandhidham|GJ|
Mau|UP|
Sikar|RJ|
Ramagundam|TS|
Hapur|UP|
Farrukhabad|UP|
Alappuzha|KL|
Katihar|BR|
Sri Ganganagar|RJ|
Rewa|MP|
Uluberiya|WB|
Sivakasi|TN|
Karur|TN|
Raichur|KA|
Pallavaram|TN|
Ooty|TN|
Pali|RJ|
Hosur|TN|
Vizianagaram|AP|
Shrirampur|WB|
Quthbullapur|TS|
Nadiad|GJ|
Nagercoil|TN|
Karawalnagar|DL|
Mango|JH|
Murwara|MP|
Kanchipuram|TN|
Singrauli|MP|
Mirzapur|UP|
Kharagpur|WB|
Eluru|AP|
Raniganj|TS|
Yamuna Nagar|HR|
Raurkela Industrial Township|OD|
Bidar|KA|
Munger|BR|
Nandyal|AP|
Panchkula|HR|
Burhanpur|MP|
Morvi|GJ|
Anand|GJ|
Ongole|AP|
Hosapete|KA|
Nangloi Jat|DL|
Deoghar|JH|
Chapra|BR|
Khandwa|MP|
Puri|OD|
Morena|MP|
Gyanpur|UP|
Bulandshahr|UP|
Bhind|MP|
Bhalswa Jahangirpur|DL|
Khammam|TS|
Sambhal|UP|
Bhiwani|HR|
Panvel|MH|
Ambala|HR|
Kumarapalayam|TN|
Machilipatnam|AP|
Mahesana|GJ|
Mahbubnagar|TS|
Sambalpur|OD|
Bhusawal|MH|
Raebareli|UP|
Haridwar|UK|
Phusro|JH|
Adoni|AP|
Sujangarh|RJ|
Sirsa|HR|
Dinapur Nizamat|BR|
Bahraigh|UP|
Karaikkudi|TN|
Sultan Pur Majra|DL|
Guna|MP|
Chandannagar|WB|
Baharampur|WB|
Shahuwadi|MH|
Madanapalle|AP|
Shivpuri|MP|
Surendranagar|GJ|
Neyveli|TN|
Silchar|AS|
Proddatur|AP|
Hugli|WB|
Hashtsal|DL|
Amroha|UP|
Chhindwara|MP|
Bhetia|JH|
Pathankot|PB|
Badlapur|MH|
Cuddalore|TN|
Shimla|HP|
Gadag-Betageri|KA|
Gadag|KA|
Veraval|GJ|
Navsari|GJ|
Bahadurgarh|HR|
Haldia|WB|
Raiganj|WB|
Malda|WB|
Jaunpur|UP|
Deoli|DL|
Bharuch|GJ|
Hoshiarpur|PB|
Jind|HR|
Kumbakonam|TN|
Mohali|PB|SAS Nagar
Fatehpur|UP|
Tonk|RJ|
Udupi|KA|
Thenali|AP|
Sitapur|UP|
Alandur|TN|
Bhadravati|KA|
Vapi|GJ|
Moga|PB|
Raj-Nandgaon|CG|
Robertsonpet|KA|
Unnao|UP|
Budaun|UP|
Madhyamgram|WB|
Chittoor|AP|
Jamuria|WB|
Jaigaon|WB|
Batala|PB|
Orai|UP|
Saharsa|BR|
Vidisha|MP|
Hanumangarh|RJ|
Thanesar|HR|
Hassan|KA|
Kishangarh|RJ|
Dalupura|DL|
Rudrapur|UK|
Nalgonda|TS|
Hazaribagh|JH|
Medinipur|WB|
Balurghat|WB|
Fyzabad|UP|
Dinapore|BR|
Porbandar|GJ|
Banda|UP|
Hindupur|AP|
Beawar|RJ|
Anantnag|JK|
Serilingampalle|TS|
Raigarh|CG|
Malkajgiri|TS|
Shantipur|WB|
Bhuj|GJ|
Barakpur|WB|
Hajipur|BR|
Sasaram|BR|
Bhimavaram|AP|
Beed|MH|
Burari|DL|
Krishnanagar|WB|
Chitradurga|KA|
Dibrugarh|AS|
Abohar|PB|
Tiruvannamalai|TN|
Kaithal|HR|
Balasore|OD|
Godhra|GJ|
Shillong|ML|
Rewari|HR|
Basirhat City|WB|
Chhatarpur|MP|
Mandsaur|MP|
Chas|JH|
Palanpur|GJ|
Lakhimpur|UP|
Valsad|GJ|
Damoh|MP|
Haldwani|UK|
Habra|WB|
Kolar|KA|
Srikakulam|AP|
Mandya|KA|
Madhurampur Dehri|BR|
Kanchrapara|WB|
Dimapur|NL|
Maler Kotla|PB|
Siwan|BR|
Kalol|GJ|
Bankura|WB|
Patan|GJ|
Gonda City|UP|
Dhaulpur|RJ|
Gondia|MH|
Palakkad|KL|
Bettiah|BR|
Palwal|HR|
Raniganj|WB|
Etah|UP|
Pilibhit|UP|
Rajapalayam|TN|
Botad|GJ|
Deoria|UP|
Nimach|RJ|
Khardah|WB|
Yavatmal|MH|
Halisahar|WB|
Khanna|PB|
Titagarh|WB|
Mustafabad|DL|
Hathras|UP|
Jorhat|AS|
Lalitpur|UP|
Guntakal|AP|
Pithampur|MP|
Mothihari|BR|
Kanhangad|KL|
Jagdalpur|CG|
Jagadhri|HR|
Darjiling|WB|
Kurichchi|TN|
Dam Dam|WB|
Hardoi|UP|
Puruliya|WB|
Dharmavaram|AP|
Gokalpur|DL|
Bhadreswar|WB|
Nagaon|AS|
Vejalpur|GJ|
Chikmagalur|KA|
Bhadrak|OD|
Sawai Madhopur|RJ|
Ambikapur|CG|
Mandoli|DL|
Satara|MH|
Churu|RJ|
Gangapur|RJ|
Madhavaram|TN|
Dohad|GJ|
Barshi|MH|
Adilabad|TS|
Jhunjhunun|RJ|
Jetpur|GJ|
Uppal Kalan|TS|
Gudivada|AP|
Baran|RJ|
Narmadapuram|MP|
Amreli|GJ|
Pudukkottai|TN|
Narasaraopet|AP|
Rishra|WB|
Baripada|OD|
Muktsar|PB|
Azamgarh|UP|
Barnala|PB|
Chittorgarh|RJ|
Tinsukia|AS|
Khargone|MP|
Baidyabati|WB|
Basti|UP|
Gangavati|KA|
Ambur|TN|
Giridih|JH|
Wardha|MH|
Tadepalligudem|AP|
Chanduasi|UP|
Bagaha|BR|
Achalpur|MH|
Gondal|GJ|
Dharashiv|MH|
Port Blair|AN|
Bagalkot|KA|
Suriapet|TS|
Bangaon|WB|
Ashoknagar Kalyangarh|WB|
Deesa|GJ|
Navadwip|WB|
Nandurbar|MH|
Sultanpur|UP|
Delhi Cantonment|DL|
Firozpur|PB|
Pandit Deen Dayal Upadhyaya Nagar|UP|
Sehore|MP|
Kanpur Cantonment|UP|
Bansbaria|WB|
Tadpatri|AP|
Jalpaiguri|WB|
Mangalagiri|AP|
Ranebennur|KA|
Khurja|UP|
Kishanganj|BR|
Ponnani|KL|
Hindaun|RJ|
Jamalpur|BR|
Nagaur|RJ|
Ambala Sadar|HR|
Bhiwadi|RJ|
Bundi|RJ|
Miryalaguda|TS|
Soyibug|JK|
Jagtial|TS|
Roorkee|UK|
Udgir|MH|
Nagda|MP|
Betul|MP|
Jahanabad|BR|
Kashipur|UK|
Ghazipur|UP|
Amaravati|AP|
Nagapattinam|TN|
Buxar|BR|
Mormugao|GA|
Seoni|MP|
Aurangabad|BR|
Hinganghat|MH|
Dhamtari|CG|
Chilakalurupet|AP|
Malappuram|KL|
Banswara|RJ|
Chirmiri|CG|
Itarsi|MP|
Vasco da Gama|GA|
Gangtok|SK|
Datia|MP|
Phagwara|PB|
Luckeesarai|BR|
Shikohabad|UP|
Kasganj|UP|
Khambhat|GJ|
Kohima|NL|
Pandharpur|MH|
Kapurthala Town|PB|
Mahuva|GJ|
Silvassa|DD|
Balangir|OD|
Nawada|BR|
Bhilai Charoda|CG|
Shamli|UP|
Jharsuguda|OD|
Sadatpur Gujran|DL|
Chalisgaon|MH|
Villupuram|TN|
Amalner|MH|
Tellicherry|KL|
Manjeri|KL|
Birgaon|CG|
Barmer|RJ|
Puth Kalan|DL|
Kuniyamuttur|TN|
Sardarshahr|RJ|
Sanand|GJ|
Sahibganj|JH|
Paramagudi|TN|
Zerakpur|PB|
Tiruchengode|TN|
Closepet|KA|
Emmiganur|AP|
Vaniyambadi|TN|
Kovilpatti|TN|
Parli Vaijnath|MH|
Mainpuri|UP|
Khamgaon|MH|
Makrana|RJ|
Allinagaram|TN|
Gudiyatham|TN|
Dhar|MP|
Baraut|UP|
Kalyani|WB|
Doddaballapura|KA|
Chirala|AP|
Akot|MH|
Fatehpur|RJ|
Gharroli|DL|
Rajpura|PB|
Ballarpur|MH|
Kot Kapura|PB|
Bhandara|MH|
Molarband|DL|
Rayachoti|AP|
Kadayanallur|TN|
Valparai|TN|
Pollachi|TN|
Kavali|AP|
Roha|MH|
Mancherial|TS|
Avaniyapuram|TN|
Muradnagar|UP|
Ankleshwar|GJ|
Kadiri|AP|
Shahdol|MP|
Shrirampur|MH|
Mahoba|UP|
Ramgarh|JH|
Contai|WB|
Sangrur|PB|
Nirmal|TS|
Deoband|UP|
Neyyattinkara|KL|
Tanda|UP|
Kolar|MP|
Jhumri Telaiya|JH|
Aruppukkottai|TN|
Faridkot|PB|
Madgaon|GA|
Velampalaiyam|TN|
Jamui|BR|
Anjar|GJ|
Paralakhemundi|OD|
Jharia|JH|
Karaikal|PY|
Kamthi|MH|
Hansi|HR|
Mayiladuthurai|TN|
Anakapalle|AP|
Maduravoyal|TN|
Sarni|MP|
Dausa|RJ|
Paradip Garh|OD|
Hingoli|MH|
Baruni|BR|
Jeypore|OD|
Bijnor|UP|
Dhoraji|GJ|
Virappanchathiram|TN|
Balaghat|MP|
Udhampur|JK|
Najibabad|UP|
Idaiyarpalaiyam|TN|
Harihar|KA|
Chilla Soroda Bangar|DL|
Sirsilla|TS|
Karauli|RJ|
Mansa|PB|
Jangipur|WB|
Gobindgarh|PB|
Saunda|JH|
Maraimalainagar|TN|
Ashoknagar|MP|
Phulwari Sharif|BR|
Mhow|MP|
Malout|PB|
Kadi|GJ|
Vijalpor|GJ|
Palakollu|AP|
Himatnagar|GJ|
Dholka|GJ|
Kotkapura|PB|
Bargarh|OD|
Kharghar|MH|
Kairana|UP|
Brajarajnagar|OD|
Kamareddi|TS|
Palwancha|TS|
Manmad|MH|
Srikalahasti|AP|
Kottagudem|TS|
Nawabganj|UP|
Gokak|KA|
Tikamgarh|MP|
Arakkonam|TN|
Araria|BR|
Koch Bihar|WB|
Kharakvasla|MH|
Bhadohi|UP|
Katoya|WB|
Medininagar|JH|
Washim|MH|
Bagbera|JH|
Savarkundla|GJ|
Basoda|MP|
Tanuku|AP|
Gurdaspur|PB|
Edattala|KL|
Bodhan|TS|
Balrampur|UP|
Baramula|JK|
Karwar|KA|
Dhulian|WB|
Rabkavi-Banhatti|KA|
Mawana|UP|
Shirpur|MH|
Budge Budge|WB|
Kundla|GJ|
Visnagar|GJ|
Kannauj|UP|
Khajoori Khas|DL|
Neelankarai|TN|
Nagina|UP|
Badagara|KL|
Fazilka|PB|
Electronic City Phase I|KA|
Ratnagiri|MH|
Keshod|GJ|
Konnagar|WB|
Chintamani|KA|
Pammal|TN|
Sindhnur|KA|
Madhubani|BR|
Bodinayakkanur|TN|
Khadki|MH|
Dhrangadhra|GJ|
Tezpur|AS|
Srivilliputhur|TN|
Benipur|BR|
Paloncha|TS|
Panaji|GA|Panjim;Goa
Margao|GA|
Manipal|KA|
Itanagar|AR|
Leh|LA|
Daman|DD|
Kavaratti|LD|
Zirakpur|PB|
Bilaspur|HP|
Udaipur|TR|
Sriperumbudur|TN|
Neemrana|RJ|
Bokaro Steel City|JH|
New York|INTL|USA;United States;NYC
San Francisco|INTL|USA;Bay Area;SF
San Jose|INTL|USA;Silicon Valley
Seattle|INTL|USA
Austin|INTL|USA;Texas
Dallas|INTL|USA;Texas
Chicago|INTL|USA
Boston|INTL|USA
Toronto|INTL|Canada
London|INTL|UK;United Kingdom
Dublin|INTL|Ireland
Amsterdam|INTL|Netherlands
Berlin|INTL|Germany
Munich|INTL|Germany
Paris|INTL|France
Zurich|INTL|Switzerland
Singapore|INTL|SG
Kuala Lumpur|INTL|Malaysia;KL
Hong Kong|INTL|HK
Tokyo|INTL|Japan
Sydney|INTL|Australia
Melbourne|INTL|Australia
Dubai|INTL|UAE;United Arab Emirates
Abu Dhabi|INTL|UAE
Riyadh|INTL|Saudi Arabia;KSA
Doha|INTL|Qatar
`;

  var HUBS = ["Bengaluru", "Mumbai", "New Delhi", "Hyderabad", "Chennai", "Pune", "Gurugram", "Noida", "Kolkata", "Ahmedabad", "Kochi", "Coimbatore", "Jaipur", "Chandigarh", "Thiruvananthapuram", "Navi Mumbai", "Thane", "Indore", "Mysuru", "Vadodara", "Nagpur", "Visakhapatnam", "Bhubaneswar", "Lucknow", "Mangaluru", "Ghaziabad", "Faridabad", "Greater Noida", "Mohali", "Surat", "Kanpur", "Panaji", "Vijayawada", "Madurai", "Nashik", "Bhopal", "Dehradun", "Guwahati", "Gandhinagar"];

  var ST = {};
  ST_RAW.trim().split('\n').forEach(function (l) { var p = l.split('|'); ST[p[0]] = p[1]; });
  var COMPANIES = RAW.trim().split('\n').map(function (l) {
    var p = l.split('|'); return { name: p[0], ind: +p[1] };
  });
  var CITIES = CITY_RAW.trim().split('\n').map(function (l) {
    var p = l.split('|');
    return { name: p[0], st: p[1], alias: p[2] ? p[2].split(';') : [], hub: HUBS.indexOf(p[0]) };
  });

  window.TAD_FORM_DATA = { IND: IND, COMPANIES: COMPANIES, ST: ST, CITIES: CITIES, HUBS: HUBS };
})();
