import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Modal, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // Importe os ícones necessários
import axios from 'axios';

const App = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('eur'); // Padrão: EUR
  const [modalVisible, setModalVisible] = useState(false);

  const updateCountdown = async () => {
    // Calculate the target date (April 1, 2024, 00:00:00 UTC)
    const targetDate = new Date('2024-04-22T00:00:00Z').getTime();

    // Get the current time
    const currentTime = new Date().getTime();

    // Calculate the time difference in seconds
    const timeDifferenceInSeconds = Math.floor((targetDate - currentTime) / 1000);

    if (timeDifferenceInSeconds > 0) {
      const daysRemaining = Math.floor(timeDifferenceInSeconds / (24 * 60 * 60));
      const hoursRemaining = Math.floor((timeDifferenceInSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutesRemaining = Math.floor((timeDifferenceInSeconds % (60 * 60)) / 60);
      const secondsRemaining = timeDifferenceInSeconds % 60;

      setDays(daysRemaining);
      setHours(hoursRemaining);
      setMinutes(minutesRemaining);
      setSeconds(secondsRemaining);
    } else {
      // If the countdown is already finished, add 4 years to the countdown
      const currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 4);

      const newTargetDate = currentDate.getTime();
      const newTimeDifferenceInSeconds = Math.floor((newTargetDate - currentTime) / 1000);

      const newDaysRemaining = Math.floor(newTimeDifferenceInSeconds / (24 * 60 * 60));
      const newHoursRemaining = Math.floor((newTimeDifferenceInSeconds % (24 * 60 * 60)) / (60 * 60));
      const newMinutesRemaining = Math.floor((newTimeDifferenceInSeconds % (60 * 60)) / 60);
      const newSecondsRemaining = newTimeDifferenceInSeconds % 60;

      setDays(newDaysRemaining);
      setHours(newHoursRemaining);
      setMinutes(newMinutesRemaining);
      setSeconds(newSecondsRemaining);
    }

    // Atualizar o estado do preço do Bitcoin a cada 30 segundos
    if (Math.floor(new Date().getTime() / 1000) % 30 === 0) {
      await fetchBitcoinPrice(selectedCurrency);
    }
  };

  const fetchBitcoinPrice = async (currency) => {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`);
      const price = response.data.bitcoin[currency];

      setBitcoinPrice({ currency, price });
    } catch (error) {
      console.error('Erro ao obter o preço do Bitcoin:', error.message);
    }
  };

  const handleCurrencyChange = async (currency) => {
    setSelectedCurrency(currency);
    await fetchBitcoinPrice(currency);
    setModalVisible(false);
  };

  useEffect(() => {
    updateCountdown();

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [selectedCurrency]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./assets/bitcoin.png')} resizeMode="cover"         
      style={Platform.OS === 'web' ? styles.webBackground : styles.image}
      >
        

        <View style={styles.countdownContainer}>
          <Text style={styles.labelTextBTC}>Days For Halving Day Bitcoin</Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{days}</Text>
          <Text style={styles.labelText}>Days</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{hours}</Text>
          <Text style={styles.labelText}>Hours</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{minutes}</Text>
          <Text style={styles.labelText}>Minutes</Text>
        </View>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{seconds}</Text>
          <Text style={styles.labelText}>Seconds</Text>
        </View>
        
        {/* Bitcoin Price */}
        <View style={styles.countdownContainer}>
          {bitcoinPrice && (
            <Text style={styles.text}>
              Bitcoin Price: {bitcoinPrice.price} {bitcoinPrice.currency.toUpperCase()}
            </Text>
          )}
        </View>
        
        {/* TouchableOpacity para abrir o modal */}
        <TouchableOpacity style={styles.currencyButtonContainer} onPress={() => setModalVisible(true)}>
          <Text style={styles.text}>The price, choose you fiat currency</Text>
        </TouchableOpacity>

        {/* Modal para seleção da moeda */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCurrencyChange('eur')}>
              <Text style={styles.text}>EUR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCurrencyChange('usd')}>
              <Text style={styles.text}>USD</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCurrencyChange('brl')}>
              <Text style={styles.text}>BRL</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  countdownText: {
    fontSize: 36,
    color: 'white',
  },
  labelText: {
    fontSize: 18,
    color: 'white',
  },
  labelTextBTC: {
    fontSize: 26,
    color: 'white',
    marginBottom: 50,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    color: "white",
    alignItems: 'center',
    justifyContent: 'center',


  },
  currencyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%', // Set the width to cover the entire screen
  },
  webBackground: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'center',
    width: '100%', // Ajuste conforme necessário para a web
    height: '100%', // Ajuste conforme necessário para a web
  },
});

export default App;
