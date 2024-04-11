import React, {Suspense, useRef, useState} from 'react';
import {Button, SafeAreaView, View, Text, ScrollView} from 'react-native';

let cache = new Map();

function fetch(key) {
  if (!cache.has(key)) {
    cache.set(key, getData(key));
  }
  return cache.get(key);
}

async function getData(key) {
  // Add a fake delay to make waiting noticeable.
  await new Promise(resolve => {
    setTimeout(resolve, 3000);
  });
  return `Data for ${key}`;
}

function Something() {
  const [count, setCount] = useState(0);
  const data = use(fetch(count));
  return (
    <View>
      <Text>Fetched {data}</Text>
      <SomeScroll />
      <Button title="Re-render" onPress={() => setCount(v => v + 1)} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Suspense fallback={null}>
        <Something />
      </Suspense>
    </SafeAreaView>
  );
}

function SomeScroll() {
  return (
    <View style={{width: 300, height: 100}}>
      <ScrollView>
        <View style={{width: 300, height: 40, backgroundColor: 'red'}} />
        <View style={{width: 300, height: 40, backgroundColor: 'blue'}} />
        <View style={{width: 300, height: 40, backgroundColor: 'yellow'}} />
        <View style={{width: 300, height: 40, backgroundColor: 'brown'}} />
      </ScrollView>
    </View>
  );
}

function use(promise) {
  if (promise.status === 'fulfilled') {
    return promise.value;
  } else if (promise.status === 'rejected') {
    throw promise.reason;
  } else if (promise.status === 'pending') {
    throw promise;
  } else {
    promise.status = 'pending';
    promise.then(
      result => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      reason => {
        promise.status = 'rejected';
        promise.reason = reason;
      },
    );
    throw promise;
  }
}
