console.log("hi")
// run in terminal (example):
// node consumer.js -f $HOME/.confluent/nodejs.config -t govhack-casesbydateandstate
// nodejs.config is a file to customise the API key and Secret

const Kafka = require('node-rdkafka');
// util.js is the js in the same folder
const { configFromPath } = require('./util');

function createConfigMap(config) {
  if (config.hasOwnProperty('security.protocol')) {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      'sasl.username': config['sasl.username'],
      'sasl.password': config['sasl.password'],
      'security.protocol': config['security.protocol'],
      'sasl.mechanisms': config['sasl.mechanisms'],
      // replace the final letter after each request
      'group.id': 'connect-PPW-172900-g'
    }
  } else {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      // replace the final letter after each request
      'group.id': 'connect-PPW-172900-g'
    }
  }
}

function createConsumer(config, onData) {
  const consumer = new Kafka.KafkaConsumer(
      createConfigMap(config),
      {'auto.offset.reset': 'earliest'});

  return new Promise((resolve, reject) => {
    consumer
     .on('ready', () => resolve(consumer))
     .on('data', onData);

    consumer.connect();
  });
};


async function consumerExample() {
  if (process.argv.legth < 3) {
    console.log("Please provide the configuration file path as the command line argument");
    process.exit(1);
  }
  let configPath = "./nodejs.config";
  const config = await configFromPath(configPath);

  //let seen = 0;
  // replace topic to retrieve from different databases
  // govhack-act_contact_tracing_locations       
  // govhack-casesbydateandpostcode          
  // govhack-casesbydateandstate            
  // govhack-covid19data_au_state           
  // govhack-covid_cases_lga              
  // govhack-covid_cases_postcode           
  // govhack-covid_cases_postcode_likely_source    
  // govhack-covid_contact_locations          
  // govhack-covid_tests_lga              
  // govhack-covid_tests_postcode           
  // govhack-covid_tests_postcode_synthetic      
  // govhack-deathsbydateandstate           
  // govhack-meta_data                 
  // govhack-nsw_active_cases_postcode         
  // govhack-nsw_contact_tracing_flight        
  // govhack-nsw_contact_tracing_locations       
  // govhack-nsw_contact_tracing_transport       
  // govhack-nsw_contact_tracing_venues_of_concern   
  // govhack-nsw_postcode_cases            
  // govhack-nsw_tests_postcode_lga_lhd        
  // govhack-nt_contact_tracing_locations       
  // govhack-phu2postcodes               
  // govhack-population_postcode            
  // govhack-postcode2suburb              
  // govhack-postcodeadjacencies            
  // govhack-postcodewithloc              
  // govhack-qld_contact_tracing_locations       
  // govhack-sa_contact_tracing_locations_current   
  // govhack-sa_contact_tracing_locations_historical  
  // govhack-tas_contact_tracing_locations       
  // govhack-testsbydateandpostcode          
  // govhack-testsbydateandstate            
  // govhack-vic_active_cases_lga           
  // govhack-vic_active_cases_postcode         
  // govhack-vic_all_cases_acquired_source       
  // govhack-vic_all_cases_age_group          
  // govhack-vic_all_cases_lga             
  // govhack-vic_all_cases_lga_acquired_source     
  // govhack-vic_contact_tracing_locations       
  // govhack-vic_tests_lga               
  // govhack-wa_cases_by_source            
  // govhack-wa_contact_tracing_flights        
  // govhack-wa_contact_tracing_locations       
  // govhack-wa_stats_by_date
  let topic = "govhack-casesbydateandstate";

  const consumer = await createConsumer(config, ({key, value}) => {
    let k = key.toString().padEnd(10, ' ');
    // the following line is to print result, mainly in value
    console.log(`Consumed event from topic ${topic}: key = ${k} value = ${value}`);
  });

  consumer.subscribe([topic]);
  consumer.consume();

  process.on('SIGINT', () => {
    console.log('\nDisconnecting consumer ...');
    consumer.disconnect();
  });
}

consumerExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });