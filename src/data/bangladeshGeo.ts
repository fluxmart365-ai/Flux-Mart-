// Comprehensive Bangladesh Geographical Dataset: All 8 Divisions, 64 Districts, and key Thanas/Upazilas

export interface DivisionData {
  id: string;
  nameEn: string;
  nameBn: string;
  districts: DistrictData[];
}

export interface DistrictData {
  id: string;
  nameEn: string;
  nameBn: string;
  isDhakaCity?: boolean;
  isDhakaSuburbs?: boolean;
  thanas: string[];
}

export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    id: 'dhaka',
    nameEn: 'Dhaka',
    nameBn: 'ঢাকা',
    districts: [
      {
        id: 'dhaka_city',
        nameEn: 'Dhaka (City Core)',
        nameBn: 'ঢাকা (সিটি কর্পোরেশন)',
        isDhakaCity: true,
        thanas: [
          'Gulshan-1', 'Gulshan-2', 'Banani', 'Baridhara', 'Dhanmondi', 'Uttara Sector 1-18',
          'Mirpur 1-14', 'Mohakhali & DOHS', 'Bashundhara R/A', 'Motijheel', 'Badda', 'Tejgaon',
          'Mohammadpur', 'Khilgaon', 'Paltan', 'Lalbagh', 'Chawkbazar', 'Jatrabari', 'Shahbagh'
        ]
      },
      {
        id: 'dhaka_suburbs',
        nameEn: 'Dhaka (Savar & Keraniganj)',
        nameBn: 'ঢাকা (সাভার ও কেরানীগঞ্জ)',
        isDhakaSuburbs: true,
        thanas: ['Savar', 'Ashulia', 'Keraniganj', 'Dhamrai', 'Nawabganj', 'Dohar']
      },
      {
        id: 'gazipur',
        nameEn: 'Gazipur',
        nameBn: 'গাজীপুর',
        thanas: ['Gazipur Sadar', 'Tongi', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj']
      },
      {
        id: 'narayanganj',
        nameEn: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        thanas: ['Narayanganj Sadar', 'Fatullah', 'Siddhirganj', 'Bandar', 'Rupganj', 'Araihazar', 'Sonargaon']
      },
      {
        id: 'narsingdi',
        nameEn: 'Narsingdi',
        nameBn: 'নরসিংদী',
        thanas: ['Narsingdi Sadar', 'Palash', 'Shibpur', 'Belabo', 'Monohardi', 'Raipura']
      },
      {
        id: 'tangail',
        nameEn: 'Tangail',
        nameBn: 'টাঙ্গাইল',
        thanas: ['Tangail Sadar', 'Mirzapur', 'Madhupur', 'Ghatail', 'Kalihati', 'Sakhipur', 'Basail']
      },
      {
        id: 'kishoreganj',
        nameEn: 'Kishoreganj',
        nameBn: 'কিশোরগঞ্জ',
        thanas: ['Kishoreganj Sadar', 'Bhairab', 'Bajitpur', 'Katiadi', 'Karimganj', 'Tarail', 'Pakundia']
      },
      {
        id: 'manikganj',
        nameEn: 'Manikganj',
        nameBn: 'মানিকগঞ্জ',
        thanas: ['Manikganj Sadar', 'Singair', 'Saturia', 'Shibalaya', 'Ghior', 'Harirampur']
      },
      {
        id: 'munshiganj',
        nameEn: 'Munshiganj',
        nameBn: 'মুন্সীগঞ্জ',
        thanas: ['Munshiganj Sadar', 'Sreenagar', 'Sirajdikhan', 'Lohajang', 'Tongibari', 'Gazaria']
      },
      {
        id: 'faridpur',
        nameEn: 'Faridpur',
        nameBn: 'ফরিদপুর',
        thanas: ['Faridpur Sadar', 'Boalmari', 'Bhanga', 'Madhukhali', 'Nagarkanda', 'Sadarpur']
      },
      {
        id: 'gopalganj',
        nameEn: 'Gopalganj',
        nameBn: 'গোপালগঞ্জ',
        thanas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara']
      },
      {
        id: 'madaripur',
        nameEn: 'Madaripur',
        nameBn: 'মাদারীপুর',
        thanas: ['Madaripur Sadar', 'Shibchar', 'Kalkini', 'Rajoir']
      },
      {
        id: 'rajbari',
        nameEn: 'Rajbari',
        nameBn: 'রাজবাড়ী',
        thanas: ['Rajbari Sadar', 'Goalanda', 'Pangsha', 'Baliakandi', 'Kalukhali']
      },
      {
        id: 'shariatpur',
        nameEn: 'Shariatpur',
        nameBn: 'শরীয়তপুর',
        thanas: ['Shariatpur Sadar', 'Naria', 'Janjira', 'Damudya', 'Bhedarganj', 'Gosairhat']
      }
    ]
  },
  {
    id: 'chittagong',
    nameEn: 'Chittagong (Chattogram)',
    nameBn: 'চট্টগ্রাম',
    districts: [
      {
        id: 'chittagong_city',
        nameEn: 'Chittagong (Metro & Port)',
        nameBn: 'চট্টগ্রাম (মহানগর ও বন্দর)',
        thanas: ['Agrabad', 'GEC Circle', 'Nasirabad', 'Panchlaish', 'Kotwali', 'Halishahar', 'Khulshi', 'Bakalia', 'Bayezid', 'Patenga']
      },
      {
        id: 'coxs_bazar',
        nameEn: "Cox's Bazar",
        nameBn: 'কক্সবাজার',
        thanas: ["Cox's Bazar Sadar", 'Teknaf', 'Ukhiya', 'Ramu', 'Chakaria', 'Maheshkhali', 'Pekua', 'Kutubdia']
      },
      {
        id: 'comilla',
        nameEn: 'Cumilla',
        nameBn: 'কুমিল্লা',
        thanas: ['Cumilla Adarsha Sadar', 'Laksam', 'Daudkandi', 'Chandina', 'Debidwar', 'Muradnagar', 'Burichang', 'Brahmanpara']
      },
      {
        id: 'feni',
        nameEn: 'Feni',
        nameBn: 'ফেনী',
        thanas: ['Feni Sadar', 'Daganbhuiyan', 'Chhagalnaiya', 'Parshuram', 'Fulgazi', 'Sonagazi']
      },
      {
        id: 'brahmanbaria',
        nameEn: 'Brahmanbaria',
        nameBn: 'ব্রাহ্মণবাড়িয়া',
        thanas: ['Brahmanbaria Sadar', 'Ashuganj', 'Kasba', 'Nabinagar', 'Bancharampur', 'Sarail', 'Nasirnagar']
      },
      {
        id: 'noakhali',
        nameEn: 'Noakhali',
        nameBn: 'নোয়াখালী',
        thanas: ['Noakhali Sadar (Maijdee)', 'Begumganj (Chowmuhani)', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh']
      },
      {
        id: 'chandpur',
        nameEn: 'Chandpur',
        nameBn: 'চাঁদপুর',
        thanas: ['Chandpur Sadar', 'Hajiganj', 'Matlab North', 'Matlab South', 'Faridganj', 'Shahrasti', 'Kachua']
      },
      {
        id: 'lakshmipur',
        nameEn: 'Lakshmipur',
        nameBn: 'লক্ষ্মীপুর',
        thanas: ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar']
      },
      {
        id: 'rangamati',
        nameEn: 'Rangamati',
        nameBn: 'রাঙ্গামাটি',
        thanas: ['Rangamati Sadar', 'Kaptai', 'Baghaichhari', 'Barkal', 'Langadu', 'Juraichhari']
      },
      {
        id: 'bandarban',
        nameEn: 'Bandarban',
        nameBn: 'বান্দরবান',
        thanas: ['Bandarban Sadar', 'Ruma', 'Thanchi', 'Rowangchhari', 'Lama', 'Alikadam', 'Naikhongchhari']
      },
      {
        id: 'khagrachhari',
        nameEn: 'Khagrachhari',
        nameBn: 'খাগড়াছড়ি',
        thanas: ['Khagrachhari Sadar', 'Dighinala', 'Panchhari', 'Mahalchhari', 'Matiranga', 'Ramgarh', 'Manikchhari']
      }
    ]
  },
  {
    id: 'sylhet',
    nameEn: 'Sylhet',
    nameBn: 'সিলেট',
    districts: [
      {
        id: 'sylhet_sadar',
        nameEn: 'Sylhet (City & Sadar)',
        nameBn: 'সিলেট',
        thanas: ['Sylhet Sadar', 'Zindabazar', 'Amberkhana', 'Beanibazar', 'Golapganj', 'Biswanath', 'Balaganj', 'Fenchuganj', 'Zakiganj']
      },
      {
        id: 'moulvibazar',
        nameEn: 'Moulvibazar',
        nameBn: 'মৌলভীবাজার',
        thanas: ['Moulvibazar Sadar', 'Sreemangal', 'Kulaura', 'Barlekha', 'Kamalganj', 'Rajnagar', 'Juri']
      },
      {
        id: 'habiganj',
        nameEn: 'Habiganj',
        nameBn: 'হবিগঞ্জ',
        thanas: ['Habiganj Sadar', 'Madhabpur', 'Nabiganj', 'Chunarughat', 'Bahubal', 'Baniachong', 'Ajmiriganj']
      },
      {
        id: 'sunamganj',
        nameEn: 'Sunamganj',
        nameBn: 'সুনামগঞ্জ',
        thanas: ['Sunamganj Sadar', 'Chhatak', 'Jagannathpur', 'Derai', 'Tahirpur', 'Dharampasha', 'Dowarabazar']
      }
    ]
  },
  {
    id: 'rajshahi',
    nameEn: 'Rajshahi',
    nameBn: 'রাজশাহী',
    districts: [
      {
        id: 'rajshahi_sadar',
        nameEn: 'Rajshahi (City & Silk Core)',
        nameBn: 'রাজশাহী',
        thanas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Godagari', 'Paba', 'Bagha', 'Charghat', 'Tanore']
      },
      {
        id: 'bogra',
        nameEn: 'Bogura (Bogra)',
        nameBn: 'বগুড়া',
        thanas: ['Bogura Sadar', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Gabtali', 'Dhunat', 'Kahaloo', 'Nandigram']
      },
      {
        id: 'pabna',
        nameEn: 'Pabna',
        nameBn: 'পাবনা',
        thanas: ['Pabna Sadar', 'Ishwardi', 'Sujanagar', 'Santhia', 'Bera', 'Chatmohar', 'Faridpur', 'Atgharia']
      },
      {
        id: 'sirajganj',
        nameEn: 'Sirajganj',
        nameBn: 'সিরাজগঞ্জ',
        thanas: ['Sirajganj Sadar', 'Shahjadpur', 'Ullapara', 'Belkuchi', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Tarash']
      },
      {
        id: 'naogaon',
        nameEn: 'Naogaon',
        nameBn: 'নওগাঁ',
        thanas: ['Naogaon Sadar', 'Badalgachhi', 'Manda', 'Niamatpur', 'Patnitala', 'Raninagar', 'Sapahar', 'Dhamoirhat']
      },
      {
        id: 'natore',
        nameEn: 'Natore',
        nameBn: 'নাটোর',
        thanas: ['Natore Sadar', 'Baraigram', 'Bagatipara', 'Gurudaspur', 'Lalpur', 'Singra']
      },
      {
        id: 'chapainawabganj',
        nameEn: 'Chapai Nawabganj',
        nameBn: 'চাঁপাইনবাবগঞ্জ',
        thanas: ['Chapai Nawabganj Sadar', 'Shibganj', 'Bholahat', 'Gomastapur', 'Nachole']
      },
      {
        id: 'joypurhat',
        nameEn: 'Joypurhat',
        nameBn: 'জয়পুরহাট',
        thanas: ['Joypurhat Sadar', 'Panchbibi', 'Akkelpur', 'Kalai', 'Khetlal']
      }
    ]
  },
  {
    id: 'khulna',
    nameEn: 'Khulna',
    nameBn: 'খুলনা',
    districts: [
      {
        id: 'khulna_sadar',
        nameEn: 'Khulna (City & Metro)',
        nameBn: 'খুলনা',
        thanas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Dumuria', 'Batiaghata', 'Rupsha', 'Paikgachha', 'Koyra']
      },
      {
        id: 'jashore',
        nameEn: 'Jashore (Jessore)',
        nameBn: 'যশোর',
        thanas: ['Jashore Sadar', 'Jhikargachha', 'Manirampur', 'Chaugachha', 'Abhaynagar', 'Keshabpur', 'Bagherpara', 'Sharsha']
      },
      {
        id: 'kushtia',
        nameEn: 'Kushtia',
        nameBn: 'কুষ্টিয়া',
        thanas: ['Kushtia Sadar', 'Kumarkhali', 'Bheramara', 'Mirpur', 'Daulatpur', 'Khoksa']
      },
      {
        id: 'satkhira',
        nameEn: 'Satkhira',
        nameBn: 'সাতক্ষীরা',
        thanas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala']
      },
      {
        id: 'bagerhat',
        nameEn: 'Bagerhat',
        nameBn: 'বাগেরহাট',
        thanas: ['Bagerhat Sadar', 'Mongla', 'Fakirhat', 'Kachua', 'Mollahat', 'Rampal', 'Morrelganj', 'Sarankhola']
      },
      {
        id: 'chuadanga',
        nameEn: 'Chuadanga',
        nameBn: 'চুয়াডাঙ্গা',
        thanas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar']
      },
      {
        id: 'jhenaidah',
        nameEn: 'Jhenaidah',
        nameBn: 'ঝিনাইদহ',
        thanas: ['Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa']
      },
      {
        id: 'magura',
        nameEn: 'Magura',
        nameBn: 'মাগুরা',
        thanas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur']
      },
      {
        id: 'meherpur',
        nameEn: 'Meherpur',
        nameBn: 'মেহেরপুর',
        thanas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar']
      },
      {
        id: 'narail',
        nameEn: 'Narail',
        nameBn: 'নড়াইল',
        thanas: ['Narail Sadar', 'Kalia', 'Lohagara']
      }
    ]
  },
  {
    id: 'barisal',
    nameEn: 'Barishal',
    nameBn: 'বরিশাল',
    districts: [
      {
        id: 'barisal_sadar',
        nameEn: 'Barishal (City & Sadar)',
        nameBn: 'বরিশাল',
        thanas: ['Kotwali (Barishal)', 'Airport', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur']
      },
      {
        id: 'patuakhali',
        nameEn: 'Patuakhali',
        nameBn: 'পটুয়াখালী',
        thanas: ['Patuakhali Sadar', 'Kuakata', 'Bauphal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali']
      },
      {
        id: 'bhola',
        nameEn: 'Bhola',
        nameBn: 'ভোলা',
        thanas: ['Bhola Sadar', 'Borhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin']
      },
      {
        id: 'pirojpur',
        nameEn: 'Pirojpur',
        nameBn: 'পিরোজপুর',
        thanas: ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad (Swarupkati)', 'Zianagar']
      },
      {
        id: 'barguna',
        nameEn: 'Barguna',
        nameBn: 'বরগুনা',
        thanas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali']
      },
      {
        id: 'jhalokati',
        nameEn: 'Jhalokati',
        nameBn: 'ঝালকাঠি',
        thanas: ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur']
      }
    ]
  },
  {
    id: 'rangpur',
    nameEn: 'Rangpur',
    nameBn: 'রংপুর',
    districts: [
      {
        id: 'rangpur_sadar',
        nameEn: 'Rangpur (City & Sadar)',
        nameBn: 'রংপুর',
        thanas: ['Kotwali (Rangpur)', 'Tajhat', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj']
      },
      {
        id: 'dinajpur',
        nameEn: 'Dinajpur',
        nameBn: 'দিনাজপুর',
        thanas: ['Dinajpur Sadar', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur']
      },
      {
        id: 'kurigram',
        nameEn: 'Kurigram',
        nameBn: 'কুড়িগ্রাম',
        thanas: ['Kurigram Sadar', 'Nageshwari', 'Bhurungamari', 'Chilmari', 'Rajarhat', 'Rowmari', 'Ulipur']
      },
      {
        id: 'gaibandha',
        nameEn: 'Gaibandha',
        nameBn: 'গাইবান্ধা',
        thanas: ['Gaibandha Sadar', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj']
      },
      {
        id: 'nilphamari',
        nameEn: 'Nilphamari',
        nameBn: 'নীলফামারী',
        thanas: ['Nilphamari Sadar', 'Saidpur', 'Domar', 'Dimla', 'Jaldhaka', 'Kishoreganj']
      },
      {
        id: 'lalmonirhat',
        nameEn: 'Lalmonirhat',
        nameBn: 'লালমনিরহাট',
        thanas: ['Lalmonirhat Sadar', 'Aditmari', 'Kaliganj', 'Hatibandha', 'Patgram']
      },
      {
        id: 'thakurgaon',
        nameEn: 'Thakurgaon',
        nameBn: 'ঠাকুরগাঁও',
        thanas: ['Thakurgaon Sadar', 'Pirganj', 'Ranisankail', 'Baliadangi', 'Haripur']
      },
      {
        id: 'panchagarh',
        nameEn: 'Panchagarh',
        nameBn: 'পঞ্চগড়',
        thanas: ['Panchagarh Sadar', 'Tetulia', 'Boda', 'Debiganj', 'Atwari']
      }
    ]
  },
  {
    id: 'mymensingh',
    nameEn: 'Mymensingh',
    nameBn: 'ময়মনসিংহ',
    districts: [
      {
        id: 'mymensingh_sadar',
        nameEn: 'Mymensingh (City & Sadar)',
        nameBn: 'ময়মনসিংহ',
        thanas: ['Kotwali (Mymensingh)', 'Muktagachha', 'Trishal', 'Bhaluka', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Nandail', 'Phulpur', 'Tara Khanda']
      },
      {
        id: 'jamalpur',
        nameEn: 'Jamalpur',
        nameBn: 'জামালপুর',
        thanas: ['Jamalpur Sadar', 'Bakshiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari']
      },
      {
        id: 'netrokona',
        nameEn: 'Netrokona',
        nameBn: 'নেত্রকোণা',
        thanas: ['Netrokona Sadar', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Madan', 'Mohanganj', 'Purbadhala']
      },
      {
        id: 'sherpur',
        nameEn: 'Sherpur',
        nameBn: 'শেরপুর',
        thanas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi']
      }
    ]
  }
];

export function calculateShippingFee(divisionId: string, districtId: string): { fee: number; eta: string; label: string } {
  if (districtId === 'dhaka_city') {
    return { fee: 60, eta: 'Same-day or 24 Hours', label: 'Inside Dhaka Core Hub' };
  }
  if (districtId === 'dhaka_suburbs' || districtId === 'gazipur' || districtId === 'narayanganj') {
    return { fee: 80, eta: '24-36 Hours', label: 'Dhaka Suburbs & Greater Region' };
  }
  if (divisionId === 'chittagong' || divisionId === 'sylhet') {
    return { fee: 110, eta: '36-48 Hours', label: 'Major Divisional Hub Express' };
  }
  return { fee: 120, eta: '48-72 Hours', label: 'Nationwide 64-District Courier' };
}

export function formatDetailedAddress(addr: {
  houseOrVillage: string;
  roadOrBlock: string;
  wardNo: string;
  thana: string;
  district: string;
  division: string;
}): string {
  const parts: string[] = [];
  if (addr.houseOrVillage?.trim()) parts.push(addr.houseOrVillage.trim());
  if (addr.roadOrBlock?.trim()) parts.push(addr.roadOrBlock.trim());
  if (addr.wardNo?.trim()) parts.push(`Ward #${addr.wardNo.replace(/^ward\s*#?/i, '').trim()}`);
  if (addr.thana?.trim()) parts.push(addr.thana.trim());
  if (addr.district?.trim()) parts.push(addr.district.trim());
  if (addr.division?.trim()) parts.push(addr.division.trim());
  return parts.join(', ');
}
