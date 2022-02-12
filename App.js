import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
export default function App() {
  const [task, setTask] = useState([]); // Aqui fica salvo a lista
  const [newTask, setNewTask] = useState(""); // Aqui pega do input e joga

  async function addTask() {
    if (newTask === "") {
      return;
    }
    const search = task.filter((task) => task === newTask);
    if (search.length != 0) {
      Alert.alert("Atenção", "A tarefa já exista");
      return;
    }
    setTask([...task, newTask]);
    setNewTask("");
    Keyboard.dismiss();
  }

  async function removeTask(item) {
    setTask(task.filter((tasks) => tasks != item));
  }

  useEffect(() => {
    async function loadData() {
      const task = await AsyncStorage.getItem("task");

      if (task) {
        setTask(JSON.parse(task));
      }
    }
    loadData();
  }, []);
  useEffect(() => {
    async function saveData() {
      AsyncStorage.setItem("task", JSON.stringify(task));
    }
    saveData();
  }, [task]);

  return (
    <>
      <KeyboardAvoidingView
        keyboardVerticalOffset={0}
        behavior="padding"
        style={{ flex: 1 }}
        enabled={Platform.OS === "ios"}
      >
        <View style={styles.container}>
          <View style={styles.Hero}>
            <Text style={styles.Title}>Lembretes do dia</Text>

            <SimpleLineIcons name="note" size={24} color="white" />
          </View>
          <View style={styles.Body}>
            <FlatList
              style={styles.FlatList}
              data={task}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.ContainerList}>
                  <Text style={styles.Text}>{item}</Text>
                  <TouchableOpacity onPress={() => removeTask(item)}>
                    <MaterialCommunityIcons
                      name="delete-forever"
                      size={24}
                      color="#f0002f"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
          <View style={styles.Form}>
            <TextInput
              style={styles.Input}
              placeholderTextColor="#999"
              autoCorrect={true}
              placeholder="Adicione uma tarefa"
              maxLength={30}
              onChangeText={(text) => setNewTask(text)}
              value={newTask}
            />
            <TouchableOpacity style={styles.Button} onPress={() => addTask()}>
              <Ionicons name="add-sharp" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  Body: {
    flex: 1,
  },
  Hero: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    justifyContent: "center",
  },
  Title: {
    color: "#FFFF",
    fontWeight: "bold",
    fontSize: 18,
    paddingRight: 10,
  },
  Form: {
    padding: 0,
    height: 60,
    justifyContent: "center",
    alignSelf: "stretch",
    flexDirection: "row",
    paddingTop: 13,
    borderTopWidth: 1,
    borderColor: "#151515",
  },
  Input: {
    flex: 1,
    height: 40,
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: "#151515",
  },
  Button: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1c6e",
    borderRadius: 100,
    marginLeft: 10,
  },
  FlatList: {
    flex: 1,
    marginTop: 30,
  },
  ContainerList: {
    marginBottom: 15,
    padding: 15,
    borderRadius: 4,
    backgroundColor: "#151515",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Text: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
});
