import { useEffect, useState } from "react";
import { Text, ScrollView } from "react-native";

import Screen from "../components/Screen";
import Card from "../components/Card";

import { getData } from "../services/storage";

export default function HistoryScreen() {
  const [requests, setRequests] =
    useState<any[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data =
      (await getData("requests")) || [];

    setRequests(data.reverse());
  };

  return (
    <Screen>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Historial
      </Text>

      <ScrollView>
        {requests.map((item) => (
          <Card key={item.id}>
            <Text>
              ${item.amount.toLocaleString()}
            </Text>

            <Text>
              {item.address}
            </Text>

            <Text>
              {item.status}
            </Text>

            <Text>
              {item.date}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}