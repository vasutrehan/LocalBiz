const fs = require('fs');

// 1. Update authStore.ts
const authStorePath = 'src/store/authStore.ts';
let authStoreContent = fs.readFileSync(authStorePath, 'utf8');
authStoreContent = authStoreContent.replace(
  "register: (name: string, email: string, password: string, phone: string) => Promise<void>;",
  "register: (name: string, email: string, password: string, phone: string, role?: string) => Promise<void>;"
);
authStoreContent = authStoreContent.replace(
  "register: async (name, email, password, phone) => {",
  "register: async (name, email, password, phone, role) => {"
);
authStoreContent = authStoreContent.replace(
  "const res = await api.post('/auth/register', { name, email, password, phone });",
  "const res = await api.post('/auth/register', role ? { name, email, password, phone, role } : { name, email, password, phone });"
);
fs.writeFileSync(authStorePath, authStoreContent);


// 2. Update RegisterScreen.tsx
const regScreenPath = 'src/screens/RegisterScreen.tsx';
let regContent = fs.readFileSync(regScreenPath, 'utf8');

// Add Switch import if not there
if (!regContent.includes(', Switch')) {
  regContent = regContent.replace("KeyboardAvoidingView, Platform, StatusBar } from 'react-native';", "KeyboardAvoidingView, Platform, StatusBar, Switch } from 'react-native';");
}

// Add state for role
if (!regContent.includes('const [isOwner, setIsOwner] = useState(false)')) {
  regContent = regContent.replace(
    "const [error, setError] = useState('');",
    "const [error, setError] = useState('');\n  const [isOwner, setIsOwner] = useState(false);"
  );
}

// Read query params from router (expo-router)
if (!regContent.includes('useLocalSearchParams')) {
  regContent = regContent.replace("import { useRouter } from 'expo-router';", "import { useRouter, useLocalSearchParams } from 'expo-router';");
  regContent = regContent.replace(
    "const router = useRouter();",
    "const router = useRouter();\n  const params = useLocalSearchParams();\n  React.useEffect(() => { if (params.role === 'owner') setIsOwner(true); }, [params.role]);"
  );
}

// Update handleRegister call
regContent = regContent.replace(
  "await register(form.name, form.email, form.password, form.phone);",
  "await register(form.name, form.email, form.password, form.phone, isOwner ? 'owner' : 'customer');"
);

// Add switch UI
const termsIndex = regContent.indexOf('<Text style={styles.terms}>');
if (termsIndex !== -1 && !regContent.includes('Register as a Business Owner')) {
  const switchUI = `
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
              <Text style={{ fontSize: 14, fontFamily: Typography.bodySemiBold, color: Colors.text }}>Register as a Business Owner</Text>
              <Switch value={isOwner} onValueChange={setIsOwner} trackColor={{ true: Colors.primary, false: Colors.border }} />
            </View>
            `;
  regContent = regContent.slice(0, termsIndex) + switchUI + regContent.slice(termsIndex);
}
fs.writeFileSync(regScreenPath, regContent);


// 3. Update LoginScreen.tsx
const loginPath = 'src/screens/LoginScreen.tsx';
let loginContent = fs.readFileSync(loginPath, 'utf8');
if (!loginContent.includes('Register as a Business Owner →')) {
  const loginLinkReplacement = `
            <TouchableOpacity onPress={() => router.replace('/register')}>
              <Text style={styles.registerLink}>Sign up →</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.registerRow, { marginTop: 8 }]}>
            <Text style={styles.registerText}>Are you a business?</Text>
            <TouchableOpacity onPress={() => router.replace('/register?role=owner')}>
              <Text style={styles.registerLink}>Register as a Business Owner →</Text>
            </TouchableOpacity>
`;
  loginContent = loginContent.replace(`
            <TouchableOpacity onPress={() => router.replace('/register' as any)}>
              <Text style={styles.registerLink}>Sign up →</Text>
            </TouchableOpacity>
`, loginLinkReplacement);
}
fs.writeFileSync(loginPath, loginContent);

console.log('Auth screens updated');
