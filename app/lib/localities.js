// Locality → district code mapping
// Covers major towns, wards, suburbs across all 14 Kerala districts.
// Search "vazhakkala" → shows Ernakulam, etc.

export const LOCALITY_MAP = {
  // ── THIRUVANANTHAPURAM ───────────────────────────────────
  'vattiyoorkavu': 'TVM', 'kazhakuttam': 'TVM', 'technopark': 'TVM',
  'peroorkada': 'TVM', 'poojappura': 'TVM', 'palayam': 'TVM',
  'thampanoor': 'TVM', 'statue': 'TVM', 'vellayambalam': 'TVM',
  'pettah': 'TVM', 'east fort': 'TVM', 'chalai': 'TVM',
  'karamana': 'TVM', 'pappanamcode': 'TVM', 'nemom': 'TVM',
  'sreekaryam': 'TVM', 'ulloor': 'TVM', 'medical college': 'TVM',
  'kesavadasapuram': 'TVM', 'sasthamangalam': 'TVM', 'kowdiar': 'TVM',
  'vazhuthacaud': 'TVM', 'bakery junction': 'TVM', 'pmg': 'TVM',
  'attingal': 'TVM', 'varkala': 'TVM', 'chirayinkeezhu': 'TVM',
  'neyyattinkara': 'TVM', 'nedumangad': 'TVM', 'kilimanoor': 'TVM',
  'parassala': 'TVM', 'balaramapuram': 'TVM', 'vizhinjam': 'TVM',
  'kovalam': 'TVM', 'thumba': 'TVM', 'kazhakoottam': 'TVM',
  'kazhakkoottam': 'TVM', 'technocity': 'TVM', 'pothencode': 'TVM',

  // ── KOLLAM ───────────────────────────────────────────────
  'kollam city': 'KLM', 'chinnakada': 'KLM', 'parippally': 'KLM',
  'karunagappally': 'KLM', 'chathanoor': 'KLM', 'kundara': 'KLM',
  'punalur': 'KLM', 'chadayamangalam': 'KLM', 'sasthamkotta': 'KLM',
  'kottarakkara': 'KLM', 'pathanapuram': 'KLM', 'anchal': 'KLM',
  'kureepuzha': 'KLM', 'eravipuram': 'KLM', 'asramam': 'KLM',
  'thirumullavaram': 'KLM', 'kilikolloor': 'KLM', 'kadappakada': 'KLM',
  'mayyanad': 'KLM', 'perinad': 'KLM', 'chavara': 'KLM',

  // ── PATHANAMTHITTA ───────────────────────────────────────
  'thiruvalla': 'PTA', 'adoor': 'PTA', 'ranni': 'PTA',
  'konni': 'PTA', 'pandalam': 'PTA', 'kozhencherry': 'PTA',
  'mallappally': 'PTA', 'aranmula': 'PTA', 'chengannur': 'PTA',
  'maramon': 'PTA', 'perunadu': 'PTA', 'kuttoor': 'PTA',
  'ezhamkulam': 'PTA', 'thumpamon': 'PTA', 'naranganam': 'PTA',
  'pathanamthitta town': 'PTA', 'seethathode': 'PTA',

  // ── ALAPPUZHA ────────────────────────────────────────────
  'alappuzha town': 'ALP', 'alleppey': 'ALP', 'cherthala': 'ALP',
  'kayamkulam': 'ALP', 'haripad': 'ALP', 'ambalappuzha': 'ALP',
  'mavelikkara': 'ALP', 'kuttanad': 'ALP', 'champakulam': 'ALP',
  'muhamma': 'ALP', 'thuravoor': 'ALP', 'aroor': 'ALP',
  'mararikulam': 'ALP', 'arthunkal': 'ALP', 'chennamkary': 'ALP',
  'kainakary': 'ALP', 'purakkad': 'ALP', 'mannar': 'ALP',
  'edathua': 'ALP', 'harippad': 'ALP', 'karuvatta': 'ALP',

  // ── KOTTAYAM ─────────────────────────────────────────────
  'kottayam town': 'KTM', 'changanacherry': 'KTM', 'pala': 'KTM',
  'palai': 'KTM', 'ettumanoor': 'KTM', 'vaikom': 'KTM',
  'thodupuzha': 'KTM', 'erattupetta': 'KTM', 'kanjirappally': 'KTM',
  'mundakayam': 'KTM', 'ponkunnam': 'KTM', 'pampady': 'KTM',
  'meenachil': 'KTM', 'kaduthuruthy': 'KTM', 'uzhavoor': 'KTM',
  'karukachal': 'KTM', 'chirackadavu': 'KTM', 'kumarakom': 'KTM',
  'nattakom': 'KTM', 'thirunakkara': 'KTM', 'nagambadam': 'KTM',

  // ── IDUKKI ───────────────────────────────────────────────
  'munnar': 'IDK', 'kattappana': 'IDK', 'thodupuzha': 'IDK',
  'adimali': 'IDK', 'devikulam': 'IDK', 'udumbanchola': 'IDK',
  'azhutha': 'IDK', 'rajakkad': 'IDK', 'vandiperiyar': 'IDK',
  'kumily': 'IDK', 'thekkady': 'IDK', 'painavu': 'IDK',
  'idukki town': 'IDK', 'cheruthoni': 'IDK', 'peerumade': 'IDK',
  'nedumkandam': 'IDK', 'upputhara': 'IDK', 'marayoor': 'IDK',

  // ── ERNAKULAM ────────────────────────────────────────────
  'vazhakkala': 'EKM', 'kakkanad': 'EKM', 'edappally': 'EKM',
  'aluva': 'EKM', 'thrippunithura': 'EKM', 'vyttila': 'EKM',
  'palarivattom': 'EKM', 'kalamassery': 'EKM', 'angamaly': 'EKM',
  'perumbavoor': 'EKM', 'muvattupuzha': 'EKM', 'kothamangalam': 'EKM',
  'fort kochi': 'EKM', 'mattancherry': 'EKM', 'fort cochin': 'EKM',
  'broadway': 'EKM', 'mg road': 'EKM', 'marine drive': 'EKM',
  'kaloor': 'EKM', 'kadavanthra': 'EKM', 'vytilla': 'EKM',
  'tripunithura': 'EKM', 'north paravur': 'EKM', 'paravur': 'EKM',
  'cheranalloor': 'EKM', 'piravom': 'EKM', 'kolenchery': 'EKM',
  'mulanthuruthy': 'EKM', 'thripunithura': 'EKM', 'chottanikkara': 'EKM',
  'manjapra': 'EKM', 'bhoothathankettu': 'EKM', 'koothattukulam': 'EKM',
  'poothrikka': 'EKM', 'okkal': 'EKM', 'kizhathadiyoor': 'EKM',
  'thalayolaparambu': 'EKM', 'kuruppampady': 'EKM', 'ramamangalam': 'EKM',
  'vazhakulam': 'EKM', 'mazhuvannur': 'EKM', 'chengamanad': 'EKM',
  'eloor': 'EKM', 'udayamperoor': 'EKM', 'maradu': 'EKM',
  'njarakkal': 'EKM', 'cherai': 'EKM', 'munambam': 'EKM',
  'kochi': 'EKM', 'ernakulam city': 'EKM', 'infopark': 'EKM',
  'smart city': 'EKM', 'vytila': 'EKM', 'thevara': 'EKM',
  'panampilly nagar': 'EKM', 'ravipuram': 'EKM', 'elamakkara': 'EKM',
  'pulinchodu': 'EKM', 'periyar nagar': 'EKM', 'Gandhi nagar': 'EKM',

  // ── THRISSUR ─────────────────────────────────────────────
  'chalakudy': 'TCR', 'irinjalakuda': 'TCR', 'guruvayur': 'TCR',
  'kodungallur': 'TCR', 'kunnamkulam': 'TCR', 'wadakkanchery': 'TCR',
  'thrissur city': 'TCR', 'thrissur town': 'TCR', 'swaraj round': 'TCR',
  'punnayurkulam': 'TCR', 'chavakkad': 'TCR', 'ponnani': 'TCR',
  'paralam': 'TCR', 'arimbur': 'TCR', 'ollukkara': 'TCR',
  'avinissery': 'TCR', 'kolazhy': 'TCR', 'mulankunnathukavu': 'TCR',
  'mannuthy': 'TCR', 'puzhakkal': 'TCR', 'mala': 'TCR',
  'chalissery': 'TCR', 'pavaratty': 'TCR', 'triprayar': 'TCR',
  'mathilakam': 'TCR', 'mukundapuram': 'TCR', 'nadathara': 'TCR',
  'viyyur': 'TCR', 'chemmanda': 'TCR', 'engandiyoor': 'TCR',

  // ── PALAKKAD ─────────────────────────────────────────────
  'palakkad town': 'PKD', 'palghat': 'PKD', 'ottapalam': 'PKD',
  'shoranur': 'PKD', 'mannarkkad': 'PKD', 'chittur': 'PKD',
  'alathur': 'PKD', 'cherpulassery': 'PKD', 'shornur': 'PKD',
  'malampuzha': 'PKD', 'kollengode': 'PKD', 'nemmara': 'PKD',
  'kuzhalmannam': 'PKD', 'pattambi': 'PKD', 'kondotty': 'PKD',
  'agali': 'PKD', 'attappadi': 'PKD', 'mannarkad': 'PKD',
  'thrithala': 'PKD', 'kongad': 'PKD', 'vandazhi': 'PKD',

  // ── MALAPPURAM ───────────────────────────────────────────
  'tirur': 'MLP', 'manjeri': 'MLP', 'perinthalmanna': 'MLP',
  'malappuram town': 'MLP', 'nilambur': 'MLP', 'tirurrangadi': 'MLP',
  'tanur': 'MLP', 'areekode': 'MLP', 'wandoor': 'MLP',
  'edappal': 'MLP', 'kottakkal': 'MLP', 'vengara': 'MLP',
  'ponnani': 'MLP', 'valanchery': 'MLP', 'parappanangadi': 'MLP',
  'tavanur': 'MLP', 'trithala': 'MLP', 'mankada': 'MLP',
  'kondotty': 'MLP', 'tirurankadi': 'MLP', 'angadipuram': 'MLP',
  'kalpakanchery': 'MLP', 'pandikkad': 'MLP', 'mampad': 'MLP',

  // ── KOZHIKODE ────────────────────────────────────────────
  'kozhikode city': 'KZD', 'calicut': 'KZD', 'vadakara': 'KZD',
  'koyilandy': 'KZD', 'feroke': 'KZD', 'payyoli': 'KZD',
  'beypore': 'KZD', 'chelannur': 'KZD', 'perambra': 'KZD',
  'thiruvambady': 'KZD', 'koduvally': 'KZD', 'thamarassery': 'KZD',
  'balussery': 'KZD', 'mukkom': 'KZD', 'nanmanda': 'KZD',
  'nadapuram': 'KZD', 'kuttiadi': 'KZD', 'kuttiyadi': 'KZD',
  'mavoor': 'KZD', 'ramanattukara': 'KZD', 'elathur': 'KZD',
  'chevayur': 'KZD', 'medical college kozhikode': 'KZD',
  'west hill': 'KZD', 'east hill': 'KZD', 'palayam kozhikode': 'KZD',
  'arayidathupalam': 'KZD', 'mooriyad': 'KZD', 'narikkuni': 'KZD',

  // ── WAYANAD ──────────────────────────────────────────────
  'kalpetta': 'WYD', 'mananthavady': 'WYD', 'sulthan bathery': 'WYD',
  'sultan bathery': 'WYD', 'vythiri': 'WYD', 'ambalavayal': 'WYD',
  'panamaram': 'WYD', 'pulpally': 'WYD', 'meppadi': 'WYD',
  'nenmeni': 'WYD', 'meenangadi': 'WYD', 'thirunelly': 'WYD',
  'poothadi': 'WYD', 'noolpuzha': 'WYD', 'thariyode': 'WYD',
  'edavaka': 'WYD', 'kenichira': 'WYD', 'kottathara': 'WYD',

  // ── KANNUR ───────────────────────────────────────────────
  'kannur city': 'KNR', 'thalassery': 'KNR', 'iritty': 'KNR',
  'payyanur': 'KNR', 'mattannur': 'KNR', 'kuthuparamba': 'KNR',
  'taliparamba': 'KNR', 'sreekandapuram': 'KNR', 'peravoor': 'KNR',
  'mananthavady': 'KNR', 'payyannur': 'KNR', 'cherupuzha': 'KNR',
  'irikkur': 'KNR', 'koothuparamba': 'KNR', 'thaliparamba': 'KNR',
  'kannavam': 'KNR', 'chapparapadavu': 'KNR', 'pattiam': 'KNR',
  'chirakkal': 'KNR', 'anjarakandy': 'KNR', 'aralam': 'KNR',

  // ── KASARAGOD ────────────────────────────────────────────
  'kasaragod town': 'KGD', 'kanhangad': 'KGD', 'hosdurg': 'KGD',
  'manjeshwar': 'KGD', 'nileshwar': 'KGD', 'cheruvathur': 'KGD',
  'bekal': 'KGD', 'trikaripur': 'KGD', 'uppala': 'KGD',
  'delampady': 'KGD', 'bedadka': 'KGD', 'kumbla': 'KGD',
  'balal': 'KGD', 'mogral puthur': 'KGD', 'padne': 'KGD',
  'mulleria': 'KGD', 'vorkady': 'KGD', 'enmakaje': 'KGD',
}
