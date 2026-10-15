export interface McqOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  explanationIfWrong?: string;
}

export interface McqQuestion {
  id?: string;
  question: string;
  options: McqOption[];
  correctAnswer: string;
  explanationNote: string;
}

export interface TheoryBlock {
  heading: string;
  text: string;
  codeSnippet?: string;
  terminalOutput?: string;
  tip?: string;
  warning?: string;
  sampleInput?: string;
  mcq?: McqQuestion;
  retestMcq?: McqQuestion;
  questionPool?: McqQuestion[];
}

export interface SectionContent {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  readTime: string;
  objectives: string[];
  theoryBlocks: TheoryBlock[];
}

export const FULLSTACK_PART_10_SECTIONS: SectionContent[] = [
  {
    id: "10-1-react-native-basics",
    number: "10.1",
    title: "Introduction to React Native & Expo",
    subtitle: "Understand React Native architecture, build native mobile apps using Expo, and preview code in Expo Go.",
    readTime: "12 min",
    objectives: [
      "Understand how React Native renders real native Android and iOS views without a browser DOM",
      "Set up React Native projects with Expo CLI and managed workflow",
      "Preview mobile applications using the Expo Go mobile app or device simulators",
      "Contrast React web elements (div, p, span) with React Native primitives (View, Text)",
      "Understand the JavaScript bridge and modern Hermes JavaScript engine",
      "Structure React Native project folders and configuration files"
    ],
    theoryBlocks: [
      {
        heading: "React Native Architecture vs Web DOM",
        text: "React Native uses React principles to build native mobile apps; instead of rendering HTML to a browser DOM, it invokes native Android and iOS UI widgets.",
        codeSnippet: `// No HTML tags like <div>, <p>, or <button>!\nimport { View, Text } from 'react-native';\nconst App = () => (\n  <View><Text>Hello Native World!</Text></View>\n);`,
        mcq: {
          id: "q-10.1-0-v1",
          question: "How does React Native render user interfaces compared to React for web?",
          options: [
            { id: "A", text: "It maps React components directly to platform-native UI widgets (Android Views and iOS UIViews) without using a browser DOM" },
            { id: "B", text: "It runs a full Chrome browser in an invisible iframe" },
            { id: "C", text: "It compiles JavaScript directly into raw assembly machine code" },
            { id: "D", text: "It converts HTML tags to PDF documents" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native does not use HTML or a web browser DOM. Instead, it renders real native platform UI components via native platform APIs."
        },
        retestMcq: {
          id: "q-10.1-0-v2",
          question: "What happens if you attempt to use web HTML elements like `<div>` or `<p>` inside a React Native component?",
          options: [
            { id: "A", text: "React Native throws a runtime error because `div` is not a registered native component" },
            { id: "B", text: "React Native automatically converts them to `View` and `Text`" },
            { id: "C", text: "The operating system displays an alert popup" },
            { id: "D", text: "The app works normally with no difference" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native does not know about HTML DOM elements. Using `<div>` causes an invariant violation error indicating the component is unknown."
        }
      },
      {
        heading: "The Expo Toolchain & Managed Workflow",
        text: "Expo provides a suite of tools and libraries that streamline React Native development, handling native iOS/Android build files automatically in managed workflow.",
        codeSnippet: `// Initialize project with Expo CLI:\n// npx create-expo-app rate-repository-app --template expo-template-blank-typescript\n// npx expo start`,
        mcq: {
          id: "q-10.1-1-v1",
          question: "What is the primary benefit of using Expo's managed workflow for React Native development?",
          options: [
            { id: "A", text: "You write only JavaScript/TypeScript without needing Xcode or Android Studio for daily development" },
            { id: "B", text: "It eliminates the need for any JavaScript code" },
            { id: "C", text: "It runs only on desktop web browsers" },
            { id: "D", text: "It automatically publishes apps to the App Store without review" }
          ],
          correctAnswer: "A",
          explanationNote: "In Expo's managed workflow, Expo manages native iOS and Android build configurations, allowing developers to build features purely with JS/TS."
        },
        retestMcq: {
          id: "q-10.1-1-v2",
          question: "What is the Expo Go app?",
          options: [
            { id: "A", text: "A mobile client app for iOS and Android that runs your project JavaScript bundle instantly by scanning a QR code" },
            { id: "B", text: "A cloud database service" },
            { id: "C", text: "A code editor developed by Facebook" },
            { id: "D", text: "A paid subscription service required to run React Native" }
          ],
          correctAnswer: "A",
          explanationNote: "Expo Go is an app installed on physical devices or simulators that loads your app's bundle over Wi-Fi, offering instant previewing and Fast Refresh."
        }
      },
      {
        heading: "The Hermes JavaScript Engine",
        text: "Hermes is an open-source JavaScript engine optimized by Meta for running React Native on Android and iOS with fast startup and low memory usage.",
        codeSnippet: `// Hermes precompiles JavaScript into bytecode during build time,\n// reducing startup time and RAM consumption on mobile devices.`,
        mcq: {
          id: "q-10.1-2-v1",
          question: "What is Hermes in modern React Native?",
          options: [
            { id: "A", text: "An optimized JavaScript engine designed specifically for mobile apps with bytecode precompilation" },
            { id: "B", text: "A CSS-in-JS library" },
            { id: "C", text: "A state management tool replacing Redux" },
            { id: "D", text: "A vector icon pack" }
          ],
          correctAnswer: "A",
          explanationNote: "Hermes improves app launch time and memory footprint by compiling JavaScript to bytecode ahead of time, now enabled by default in React Native."
        },
        retestMcq: {
          id: "q-10.1-2-v2",
          question: "How does precompiling JavaScript into bytecode with Hermes improve mobile app performance?",
          options: [
            { id: "A", text: "The device skips parsing JavaScript source text at app launch, resulting in significantly faster Time To Interactive (TTI)" },
            { id: "B", text: "It doubles device battery capacity" },
            { id: "C", text: "It increases cellular internet bandwidth" },
            { id: "D", text: "It eliminates the need for phone storage" }
          ],
          correctAnswer: "A",
          explanationNote: "By precompiling to bytecode during build, the mobile CPU does not have to parse and compile JavaScript text on every app launch."
        }
      },
      {
        heading: "All Text Must Be Inside <Text> Components",
        text: "In React Native, any raw text string must be wrapped inside a `<Text>` component; placing raw strings inside `<View>` throws an error.",
        codeSnippet: `// Correct:\n<View>\n  <Text>Valid text</Text>\n</View>\n// ERROR: Raw text cannot be placed directly inside <View>!\n// <View>Invalid text</View>`,
        mcq: {
          id: "q-10.1-3-v1",
          question: "What happens if you place a raw text string directly inside a `<View>` without wrapping it in a `<Text>` component?",
          options: [
            { id: "A", text: "React Native throws a runtime error stating that raw text strings must be rendered within a <Text> component" },
            { id: "B", text: "It automatically styles the text as bold" },
            { id: "C", text: "The text is rendered as an image" },
            { id: "D", text: "The text is spoken aloud by the device speaker" }
          ],
          correctAnswer: "A",
          explanationNote: "Unlike web HTML where `<div>hello</div>` is valid, React Native strictly requires all text strings to reside within a `<Text>` component."
        },
        retestMcq: {
          id: "q-10.1-3-v2",
          question: "Can `<Text>` components be nested inside other `<Text>` components in React Native?",
          options: [
            { id: "A", text: "Yes, nested <Text> components inherit styling from their parent <Text> components (useful for inline bold/italic text)" },
            { id: "B", text: "No, nesting <Text> is strictly forbidden" },
            { id: "C", text: "Only if the parent has `bold={true}`" },
            { id: "D", text: "Only on iOS devices" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native supports nested `<Text>` components, where child text nodes inherit styles such as `fontSize` and `fontFamily` from the parent."
        }
      },
      {
        heading: "Fast Refresh in React Native",
        text: "Fast Refresh enables near-instant feedback for edits, preserving React component state while reloading updated UI code.",
        codeSnippet: `// Edit any component in your editor and save ->\n// Expo Go instantly updates the screen while retaining form state!`,
        mcq: {
          id: "q-10.1-4-v1",
          question: "What is Fast Refresh in React Native development?",
          options: [
            { id: "A", text: "A developer feature that hot-reloads component edits instantly while preserving local component state" },
            { id: "B", text: "A gesture that clears the device RAM" },
            { id: "C", text: "A function that pulls to refresh FlatList data" },
            { id: "D", text: "A tool that deletes cache files from the phone" }
          ],
          correctAnswer: "A",
          explanationNote: "Fast Refresh combines hot reloading with React hooks support, updating your code changes instantly without losing the current UI state."
        },
        retestMcq: {
          id: "q-10.1-4-v2",
          question: "What happens if you save a syntax error in your component while Fast Refresh is active?",
          options: [
            { id: "A", text: "A Redbox error screen overlay appears on the device detailing the syntax error and line number" },
            { id: "B", text: "The device uninstalls the app immediately" },
            { id: "C", text: "The phone restarts automatically" },
            { id: "D", text: "The computer terminal closes" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native overlays an error screen (Redbox) showing the stack trace. As soon as you correct the syntax error and save, the error clears."
        }
      },
      {
        heading: "app.json Configuration",
        text: "The `app.json` file configures app metadata for Expo: name, slug, app version, splash screen, orientation, and bundle identifiers.",
        codeSnippet: `{\n  "expo": {\n    "name": "Rate Repository App",\n    "slug": "rate-repository-app",\n    "version": "1.0.0",\n    "orientation": "portrait",\n    "icon": "./assets/icon.png"\n  }\n}`,
        mcq: {
          id: "q-10.1-5-v1",
          question: "What is the purpose of `app.json` in an Expo React Native application?",
          options: [
            { id: "A", text: "To configure app-wide metadata, build settings, permissions, icons, and bundle identifiers" },
            { id: "B", text: "To define the GraphQL server database connection" },
            { id: "C", text: "To store user authentication passwords" },
            { id: "D", text: "To replace package.json completely" }
          ],
          correctAnswer: "A",
          explanationNote: "`app.json` contains configuration used by Expo CLI and Expo Application Services (EAS) to build standalone native apps and configure app properties."
        },
        retestMcq: {
          id: "q-10.1-5-v2",
          question: "How can you lock your mobile app screen orientation to vertical only in `app.json`?",
          options: [
            { id: "A", text: `Set "orientation": "portrait" in the expo configuration object` },
            { id: "B", text: `Set "screen": "vertical"` },
            { id: "C", text: `Set "allowRotate": false in tsconfig.json` },
            { id: "D", text: `Set "gravity": "down"` }
          ],
          correctAnswer: "A",
          explanationNote: `In app.json, setting "orientation": "portrait" (or "landscape", or "default") locks or configures the device orientation.`
        }
      }
    ]
  },
  {
    id: "10-2-core-components-flexbox",
    number: "10.2",
    title: "Core Components & Layout with Flexbox",
    subtitle: "Style native interfaces with StyleSheet.create, arrange layouts with mobile Flexbox, and handle taps with Pressable.",
    readTime: "12 min",
    objectives: [
      "Create reusable, optimized styles with StyleSheet.create",
      "Master mobile Flexbox defaults: flexDirection column vs row",
      "Position and align elements using justifyContent, alignItems, and flexGrow",
      "Capture touch interactions and taps using the modern Pressable component",
      "Understand platform-specific styling differences and device status bars",
      "Build modular typography components with dynamic props"
    ],
    theoryBlocks: [
      {
        heading: "Styling with StyleSheet.create",
        text: "React Native styles are written as JavaScript objects; `StyleSheet.create` validates properties and optimizes style IDs sent across the bridge.",
        codeSnippet: `import { StyleSheet, Text, View } from 'react-native';\nconst styles = StyleSheet.create({\n  container: {\n    padding: 20,\n    backgroundColor: '#e1e4e8'\n  },\n  title: {\n    fontWeight: 'bold',\n    fontSize: 18\n  }\n});`,
        mcq: {
          id: "q-10.2-0-v1",
          question: "Why is `StyleSheet.create` preferred over passing plain inline style objects `style={{ ... }}` in React Native?",
          options: [
            { id: "A", text: "It validates style properties at compile time and assigns static IDs to avoid re-allocating objects on every render" },
            { id: "B", text: "It converts CSS into Sass stylesheets" },
            { id: "C", text: "It allows using CSS selectors like `:hover` and `::before`" },
            { id: "D", text: "Plain inline styles are forbidden by the compiler" }
          ],
          correctAnswer: "A",
          explanationNote: "`StyleSheet.create` validates property names and sends styles to native code once with a numeric ID, preventing unnecessary re-creations on every render."
        },
        retestMcq: {
          id: "q-10.2-0-v2",
          question: "How do you combine multiple styles in React Native (e.g. a base style and an active override style)?",
          options: [
            { id: "A", text: "Pass an array of styles: `style={[styles.base, isActive && styles.active]}`" },
            { id: "B", text: "Concatenate class strings with a plus sign: `style={styles.base + ' active'}`" },
            { id: "C", text: "Use the `classList` property" },
            { id: "D", text: "Wrap the component in another View" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native accepts an array of style objects. Styles later in the array override earlier ones, and falsey values (e.g. `false`, `null`) are ignored."
        }
      },
      {
        heading: "Flexbox in React Native (Column Default)",
        text: "Unlike web CSS where `flexDirection` defaults to `row`, React Native defaults `flexDirection` to `column` to match mobile vertical screens.",
        codeSnippet: `const styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    flexDirection: 'column', // DEFAULT in React Native!\n    justifyContent: 'center',\n    alignItems: 'center'\n  }\n});`,
        mcq: {
          id: "q-10.2-1-v1",
          question: "What is the default value of `flexDirection` in React Native?",
          options: [
            { id: "A", text: "`'column'` (stacks items vertically)" },
            { id: "B", text: "`'row'` (lays items horizontally)" },
            { id: "C", text: "`'grid'`" },
            { id: "D", text: "`'wrap'`" }
          ],
          correctAnswer: "A",
          explanationNote: "Because mobile screens are predominantly vertical, React Native defaults `flexDirection` to `'column'` instead of CSS's `'row'`."
        },
        retestMcq: {
          id: "q-10.2-1-v2",
          question: "What does setting `flex: 1` on a root container component do in React Native?",
          options: [
            { id: "A", text: "It causes the container to expand and fill all available screen space" },
            { id: "B", text: "It sets the container height to 1 pixel" },
            { id: "C", text: "It locks the screen scrolling" },
            { id: "D", text: "It renders exactly 1 child component" }
          ],
          correctAnswer: "A",
          explanationNote: "`flex: 1` tells the component to grow and fill its parent container completely, making it occupy the entire available screen."
        }
      },
      {
        heading: "JustifyContent vs AlignItems",
        text: "`justifyContent` aligns children along the primary axis (vertical by default), while `alignItems` aligns them along the cross axis (horizontal by default).",
        codeSnippet: `const styles = StyleSheet.create({\n  row: {\n    flexDirection: 'row',\n    justifyContent: 'space-between', // along row (horizontal)\n    alignItems: 'center'             // cross axis (vertical)\n  }\n});`,
        mcq: {
          id: "q-10.2-2-v1",
          question: "When `flexDirection: 'row'`, which property distributes items horizontally along the row?",
          options: [
            { id: "A", text: "`justifyContent`" },
            { id: "B", text: "`alignItems`" },
            { id: "C", text: "`alignSelf`" },
            { id: "D", text: "`text-align`" }
          ],
          correctAnswer: "A",
          explanationNote: "`justifyContent` always aligns along the primary axis. When `flexDirection` is `'row'`, the primary axis is horizontal."
        },
        retestMcq: {
          id: "q-10.2-2-v2",
          question: "What does `alignItems: 'stretch'` (the default cross-axis alignment in Flexbox) do?",
          options: [
            { id: "A", text: "It stretches children to match the size of the cross axis if they don't have a fixed dimension" },
            { id: "B", text: "It rotates the element 90 degrees" },
            { id: "C", text: "It scales text fonts to maximum size" },
            { id: "D", text: "It animates elements when tapped" }
          ],
          correctAnswer: "A",
          explanationNote: "`alignItems: 'stretch'` stretches children along the cross-axis unless an explicit width or height is provided."
        }
      },
      {
        heading: "Handling Taps with Pressable",
        text: "The modern `Pressable` component detects touch interactions, providing states (`pressed`) and callbacks like `onPress`.",
        codeSnippet: `import { Pressable, Text } from 'react-native';\n<Pressable\n  onPress={() => console.log('Tapped!')}\n  style={({ pressed }) => [\n    { backgroundColor: pressed ? '#ccc' : '#0366d6' },\n    styles.button\n  ]}\n>\n  <Text style={styles.buttonText}>Submit</Text>\n</Pressable>`,
        mcq: {
          id: "q-10.2-3-v1",
          question: "Which component is recommended in modern React Native for handling button clicks and touch gestures?",
          options: [
            { id: "A", text: "`Pressable`" },
            { id: "B", text: "`<button>`" },
            { id: "C", text: "`<a href>`" },
            { id: "D", text: "`<ClickArea>`" }
          ],
          correctAnswer: "A",
          explanationNote: "`Pressable` is React Native's modern, flexible core component for handling touch interactions, replacing older `Touchable*` components."
        },
        retestMcq: {
          id: "q-10.2-3-v2",
          question: "How can you apply a visual effect specifically while a user is actively pressing a `Pressable`?",
          options: [
            { id: "A", text: "Pass a function to `style`: `style={({ pressed }) => [ styles.base, pressed && styles.pressed ]}`" },
            { id: "B", text: "Use CSS `:active` selector" },
            { id: "C", text: "Set `activeColor` prop on View" },
            { id: "D", text: "Pressable does not support visual press feedback" }
          ],
          correctAnswer: "A",
          explanationNote: "`Pressable` accepts a style function that receives `{ pressed: boolean }`, allowing dynamic styles during touch press."
        }
      },
      {
        heading: "Platform-Specific Code & Status Bar",
        text: "Use `Platform.select` or `Platform.OS` to customize styles and behavior for Android vs iOS, such as adjusting for the device status bar.",
        codeSnippet: `import { Platform, StyleSheet } from 'react-native';\nimport Constants from 'expo-constants';\nconst styles = StyleSheet.create({\n  container: {\n    paddingTop: Constants.statusBarHeight,\n    fontFamily: Platform.select({\n      android: 'Roboto',\n      ios: 'Arial',\n      default: 'System'\n    })\n  }\n});`,
        mcq: {
          id: "q-10.2-4-v1",
          question: "Why should mobile apps incorporate `Constants.statusBarHeight` in top-level view padding?",
          options: [
            { id: "A", text: "To prevent top navigation content from being obscured by the device's physical status bar and notch" },
            { id: "B", text: "To increase Wi-Fi signal strength" },
            { id: "C", text: "To hide the keyboard automatically" },
            { id: "D", text: "It is required for iOS App Store submission" }
          ],
          correctAnswer: "A",
          explanationNote: "Mobile devices feature status bars with clock and battery icons (and notches/dynamic islands); padding ensures your UI renders beneath them."
        },
        retestMcq: {
          id: "q-10.2-4-v2",
          question: "How can you conditionally apply a style only on Android using the `Platform` module?",
          options: [
            { id: "A", text: "`Platform.OS === 'android' ? styles.androidStyle : null`" },
            { id: "B", text: "`if (window.android)`" },
            { id: "C", text: "`@media (android)`" },
            { id: "D", text: "`navigator.userAgent.includes('android')`" }
          ],
          correctAnswer: "A",
          explanationNote: "`Platform.OS` returns `'android'`, `'ios'`, or `'web'`, allowing clean platform-specific branching."
        }
      },
      {
        heading: "Building Modular Typography Components",
        text: "Creating a custom `<Text>` component that maps props like `color`, `fontSize`, and `fontWeight` to theme styles ensures visual consistency across the app.",
        codeSnippet: `const CustomText = ({ color, fontSize, fontWeight, style, ...props }) => {\n  const textStyles = [\n    styles.text,\n    color === 'textSecondary' && styles.colorTextSecondary,\n    fontSize === 'subheading' && styles.fontSizeSubheading,\n    fontWeight === 'bold' && styles.fontWeightBold,\n    style\n  ];\n  return <NativeText style={textStyles} {...props} />;\n};`,
        mcq: {
          id: "q-10.2-5-v1",
          question: "What is the design advantage of building a theme-aware custom typography component in React Native?",
          options: [
            { id: "A", text: "It centralizes font families, colors, and sizes into a single theme, preventing fragmented and duplicated style rules" },
            { id: "B", text: "It automatically translates text into foreign languages" },
            { id: "C", text: "It renders text in 3D" },
            { id: "D", text: "It removes the need for StyleSheet.create" }
          ],
          correctAnswer: "A",
          explanationNote: "A custom Text component provides a unified design system API, standardizing colors, font sizes, and font weights across the app."
        },
        retestMcq: {
          id: "q-10.2-5-v2",
          question: "How are unitless numbers interpreted when assigned to `fontSize`, `width`, or `height` in React Native?",
          options: [
            { id: "A", text: "As density-independent pixels (dp on Android, points on iOS)" },
            { id: "B", text: "As percentages of screen width" },
            { id: "C", text: "As millimeters" },
            { id: "D", text: "As rem units based on 16px" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native dimensions are density-independent pixels (dp/points), which automatically scale across varying screen pixel densities."
        }
      }
    ]
  },
  {
    id: "10-3-lists-navigation-forms",
    number: "10.3",
    title: "Scrolling Lists, Navigation & User Input",
    subtitle: "Render high-performance lists with FlatList, navigate with React Router Native, and handle user input.",
    readTime: "12 min",
    objectives: [
      "Render memory-efficient scrolling lists using the FlatList component",
      "Supply data, renderItem, and keyExtractor props to FlatList",
      "Separate list items using ItemSeparatorComponent",
      "Route views declaratively with React Router Native (NativeRouter, Routes, Route, Link)",
      "Capture typed user text input using TextInput and secureTextEntry",
      "Manage controlled form states and submit handlers on mobile"
    ],
    theoryBlocks: [
      {
        heading: "ScrollView vs FlatList",
        text: "`ScrollView` renders all child components at once in memory, whereas `FlatList` lazily renders only visible items on screen, providing high performance for large datasets.",
        codeSnippet: `// Use FlatList for lists of items to optimize memory!\n<FlatList\n  data={repositories}\n  renderItem={({ item }) => <RepositoryItem item={item} />}\n  keyExtractor={item => item.id}\n/>`,
        mcq: {
          id: "q-10.3-0-v1",
          question: "Why should you use `FlatList` instead of `ScrollView` when rendering large lists of data in React Native?",
          options: [
            { id: "A", text: "`FlatList` virtualizes rendering by only mounting items currently visible on screen, saving memory and preventing lag" },
            { id: "B", text: "`ScrollView` does not support touch scrolling" },
            { id: "C", text: "`FlatList` connects directly to the backend database" },
            { id: "D", text: "`ScrollView` is deprecated in React Native" }
          ],
          correctAnswer: "A",
          explanationNote: "`FlatList` virtualizes list rendering, unmounting offscreen items to keep memory footprint and frame rates smooth even with thousands of items."
        },
        retestMcq: {
          id: "q-10.3-0-v2",
          question: "What is the role of the `keyExtractor` prop in `FlatList`?",
          options: [
            { id: "A", text: "It extracts a unique string key for each item, allowing React to track identity across re-renders" },
            { id: "B", text: "It decrypts user passwords" },
            { id: "C", text: "It sorts the array alphabetically" },
            { id: "D", text: "It sets the background color of each row" }
          ],
          correctAnswer: "A",
          explanationNote: "`keyExtractor` specifies how to derive a unique key for each item in the data array, similar to React web's `key` prop."
        }
      },
      {
        heading: "Separators in FlatList",
        text: "The `ItemSeparatorComponent` prop renders a divider component between adjacent list items without adding one before the first or after the last item.",
        codeSnippet: `const ItemSeparator = () => <View style={{ height: 10, backgroundColor: '#e1e4e8' }} />;\n<FlatList\n  data={repositories}\n  ItemSeparatorComponent={ItemSeparator}\n  renderItem={({ item }) => <RepositoryItem item={item} />}\n/>`,
        mcq: {
          id: "q-10.3-1-v1",
          question: "What is the advantage of using `ItemSeparatorComponent` in `FlatList` over manual margins on list items?",
          options: [
            { id: "A", text: "It automatically renders separators only between items, omitting unwanted margins at the very top and bottom of the list" },
            { id: "B", text: "It runs faster than Flexbox" },
            { id: "C", text: "It makes list items clickable" },
            { id: "D", text: "It converts the list to a grid" }
          ],
          correctAnswer: "A",
          explanationNote: "`ItemSeparatorComponent` cleanly inserts dividers between elements without requiring manual CSS first-child or last-child edge case logic."
        },
        retestMcq: {
          id: "q-10.3-1-v2",
          question: "What does the `renderItem` callback in `FlatList` receive as its argument?",
          options: [
            { id: "A", text: "An object containing `{ item, index, separators }`" },
            { id: "B", text: "Only the item index" },
            { id: "C", text: "The entire array of data" },
            { id: "D", text: "A canvas context" }
          ],
          correctAnswer: "A",
          explanationNote: "`renderItem` receives `{ item, index, separators }`, allowing you to destructure `({ item })` to render your row component."
        }
      },
      {
        heading: "Mobile Navigation with React Router Native",
        text: "`react-router-native` brings familiar React Router components (`NativeRouter`, `Routes`, `Route`, `Link`) to React Native applications.",
        codeSnippet: `import { NativeRouter, Route, Routes, Link } from 'react-router-native';\nconst Main = () => (\n  <NativeRouter>\n    <AppBar />\n    <Routes>\n      <Route path=\"/\" element={<RepositoryList />} />\n      <Route path=\"/signin\" element={<SignIn />} />\n    </Routes>\n  </NativeRouter>\n);`,
        mcq: {
          id: "q-10.3-2-v1",
          question: "How does `NativeRouter` from `react-router-native` track navigation history without a browser URL bar?",
          options: [
            { id: "A", text: "It maintains an in-memory navigation stack history suitable for mobile environments" },
            { id: "B", text: "It saves navigation history in text files on the SD card" },
            { id: "C", text: "It communicates with native iOS Safari in the background" },
            { id: "D", text: "It encodes navigation history into device Bluetooth packets" }
          ],
          correctAnswer: "A",
          explanationNote: "`NativeRouter` uses an in-memory history implementation (`createMemoryHistory`) since mobile apps do not have a web address bar."
        },
        retestMcq: {
          id: "q-10.3-2-v2",
          question: "Which component in `react-router-native` allows users to navigate declaratively between views when tapped?",
          options: [
            { id: "A", text: "`<Link to=\"/signin\">`" },
            { id: "B", text: "`<a href=\"/signin\">`" },
            { id: "C", text: "`<NavigateButton to=\"/signin\">`" },
            { id: "D", text: "`<PushScreen url=\"/signin\">`" }
          ],
          correctAnswer: "A",
          explanationNote: "`<Link to=\"...\">` wraps child components and triggers navigation when tapped, mirroring standard React Router web behavior."
        }
      },
      {
        heading: "Handling User Text Input with TextInput",
        text: "The `<TextInput>` component accepts text input from the software keyboard; use `value` and `onChangeText` to create controlled inputs.",
        codeSnippet: `import { TextInput } from 'react-native';\n<TextInput\n  placeholder=\"Username\"\n  value={username}\n  onChangeText={text => setUsername(text)}\n  autoCapitalize=\"none\"\n/>`,
        mcq: {
          id: "q-10.3-3-v1",
          question: "What is the difference between `onChangeText` and `onChange` on React Native's `<TextInput>`?",
          options: [
            { id: "A", text: "`onChangeText` receives the updated string directly, whereas `onChange` receives the full synthetic event object" },
            { id: "B", text: "`onChangeText` only works with numbers" },
            { id: "C", text: "`onChange` is deprecated and removed" },
            { id: "D", text: "There is no difference" }
          ],
          correctAnswer: "A",
          explanationNote: "`onChangeText` provides convenience: `text => setUsername(text)` passes the string directly without requiring `e.target.value`."
        },
        retestMcq: {
          id: "q-10.3-3-v2",
          question: "How do you mask user input (e.g. for passwords) on a `<TextInput>` in React Native?",
          options: [
            { id: "A", text: "Set `secureTextEntry={true}`" },
            { id: "B", text: "Set `type=\"password\"`" },
            { id: "C", text: "Set `maskInput={true}`" },
            { id: "D", text: "Use `StyleSheet.create({ display: 'none' })`" }
          ],
          correctAnswer: "A",
          explanationNote: "`secureTextEntry={true}` tells the native platform keyboard to obscure the input text with dots or asterisks for passwords."
        }
      },
      {
        heading: "Horizontal Scrolling AppBar",
        text: "An app navigation bar with many items can enable horizontal scrolling by setting `horizontal={true}` on a `<ScrollView>`.",
        codeSnippet: `import { ScrollView, View } from 'react-native';\n<View style={styles.appBar}>\n  <ScrollView horizontal showsHorizontalScrollIndicator={false}>\n    <Link to=\"/\"><Text style={styles.tab}>Repositories</Text></Link>\n    <Link to=\"/signin\"><Text style={styles.tab}>Sign In</Text></Link>\n  </ScrollView>\n</View>`,
        mcq: {
          id: "q-10.3-4-v1",
          question: "How do you make a `<ScrollView>` scroll horizontally in React Native?",
          options: [
            { id: "A", text: "By adding the boolean prop `horizontal` (or `horizontal={true}`)" },
            { id: "B", text: "By setting `flexDirection: 'row'` on the root window" },
            { id: "C", text: "By tilting the phone sideways" },
            { id: "D", text: "By installing a third-party swipe library" }
          ],
          correctAnswer: "A",
          explanationNote: "Setting `horizontal` on `<ScrollView>` configures the native scroll container to scroll left-to-right instead of vertically."
        },
        retestMcq: {
          id: "q-10.3-4-v2",
          question: "What prop hides the horizontal scrollbar indicator on `<ScrollView>`?",
          options: [
            { id: "A", text: "`showsHorizontalScrollIndicator={false}`" },
            { id: "B", text: "`hideScrollbar={true}`" },
            { id: "C", text: "`scrollbar=\"hidden\"`" },
            { id: "D", text: "`noIndicator={true}`" }
          ],
          correctAnswer: "A",
          explanationNote: "`showsHorizontalScrollIndicator={false}` cleanly hides the scrollbar thumb while retaining full touch scrolling."
        }
      },
      {
        heading: "Keyboard Dismissal and Avoidance",
        text: "Mobile keyboards can obscure inputs; use `KeyboardAvoidingView` or `TouchableWithoutFeedback` with `Keyboard.dismiss` to manage focus.",
        codeSnippet: `import { KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';\n<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>\n  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>\n    <SignInForm />\n  </TouchableWithoutFeedback>\n</KeyboardAvoidingView>`,
        mcq: {
          id: "q-10.3-5-v1",
          question: "What problem does `KeyboardAvoidingView` solve in mobile apps?",
          options: [
            { id: "A", text: "It automatically adjusts its height or position when the virtual keyboard appears so inputs are not hidden" },
            { id: "B", text: "It prevents users from typing special characters" },
            { id: "C", text: "It disables the virtual keyboard entirely" },
            { id: "D", text: "It spell-checks form input automatically" }
          ],
          correctAnswer: "A",
          explanationNote: "When mobile software keyboards open, they can cover inputs. `KeyboardAvoidingView` shifts content upward so inputs remain visible."
        },
        retestMcq: {
          id: "q-10.3-5-v2",
          question: "How can a user dismiss the virtual keyboard by tapping outside an input field?",
          options: [
            { id: "A", text: "Wrap the container with `TouchableWithoutFeedback` and call `Keyboard.dismiss` in `onPress`" },
            { id: "B", text: "Press the phone's power button" },
            { id: "C", text: "Shake the device" },
            { id: "D", text: "The keyboard can never be dismissed manually" }
          ],
          correctAnswer: "A",
          explanationNote: "Invoking `Keyboard.dismiss()` in an `onPress` callback dismisses active software keyboards smoothly."
        }
      }
    ]
  },
  {
    id: "10-4-apollo-server-communication",
    number: "10.4",
    title: "Server Communication & Apollo Client in React Native",
    subtitle: "Connect React Native apps to GraphQL backends using Apollo Client, local network IP addressing, and environment configuration.",
    readTime: "12 min",
    objectives: [
      "Configure Apollo Client in a React Native mobile project",
      "Connect physical devices and simulators to local development servers using LAN IP addresses",
      "Store environment configuration variables with Constants.expoConfig",
      "Fetch and display remote data in FlatList using useQuery",
      "Format dates, numbers, and repository metrics for mobile displays",
      "Handle mobile network offline and error states gracefully"
    ],
    theoryBlocks: [
      {
        heading: "Connecting to Localhost from Mobile Simulators",
        text: "Physical phones and Android emulators cannot reach your development server via `localhost:4000`; you must use your machine's LAN IP address.",
        codeSnippet: `// Android Emulator uses 10.0.2.2 or your LAN IP (e.g. 192.168.1.50)\n// Physical devices on Wi-Fi must use your LAN IP:\nconst APOLLO_URI = 'http://192.168.1.50:4000/graphql';`,
        mcq: {
          id: "q-10.4-0-v1",
          question: "Why does `http://localhost:4000/graphql` fail when tested on a physical mobile device running Expo Go?",
          options: [
            { id: "A", text: "On the physical device, `localhost` refers to the phone itself, not the development computer running the backend server" },
            { id: "B", text: "Because React Native does not support HTTP" },
            { id: "C", text: "Because Apollo Client only works with HTTPS domain names" },
            { id: "D", text: "Because port 4000 is reserved by Android OS" }
          ],
          correctAnswer: "A",
          explanationNote: "`localhost` on a mobile device resolves to the device itself (127.0.0.1). To reach your computer, you must use your computer's local network IP address (e.g. `192.168.x.x`)."
        },
        retestMcq: {
          id: "q-10.4-0-v2",
          question: "What special loopback IP address does the Android SDK emulator use to access `localhost` on the host development computer?",
          options: [
            { id: "A", text: "`10.0.2.2`" },
            { id: "B", text: "`127.0.0.1`" },
            { id: "C", text: "`192.168.0.1`" },
            { id: "D", text: "`0.0.0.0`" }
          ],
          correctAnswer: "A",
          explanationNote: "Android emulators run in a virtual network where `10.0.2.2` routes to the host development machine's `127.0.0.1` loopback interface."
        }
      },
      {
        heading: "Environment Configuration with expo-constants",
        text: "Store dynamic configuration like API endpoints in `app.config.js` or `app.json` under `extra` and access them via `Constants.expoConfig`.",
        codeSnippet: `// app.config.js:\n// extra: { apolloUri: process.env.APOLLO_URI || 'http://192.168.1.50:4000/graphql' }\nimport Constants from 'expo-constants';\nconst apolloUri = Constants.expoConfig?.extra?.apolloUri;`,
        mcq: {
          id: "q-10.4-1-v1",
          question: "How do you access custom environment variables defined in Expo configuration (`app.config.js`)?",
          options: [
            { id: "A", text: "Via `Constants.expoConfig?.extra` from `expo-constants`" },
            { id: "B", text: "Directly through `window.process.env` in React Native" },
            { id: "C", text: "From `localStorage.getItem('config')`" },
            { id: "D", text: "Through the device SMS inbox" }
          ],
          correctAnswer: "A",
          explanationNote: "`expo-constants` exposes `Constants.expoConfig.extra`, allowing configuration values set in `app.config.js` to be read cleanly inside mobile code."
        },
        retestMcq: {
          id: "q-10.4-1-v2",
          question: "Why is `app.config.js` preferred over static `app.json` when configuring dynamic environment variables?",
          options: [
            { id: "A", text: "`app.config.js` is executable JavaScript, allowing dynamic reads from `process.env` and .env files" },
            { id: "B", text: "`app.json` is deprecated by Expo" },
            { id: "C", text: "`app.config.js` compresses image assets" },
            { id: "D", text: "`app.json` cannot be checked into Git" }
          ],
          correctAnswer: "A",
          explanationNote: "`app.config.js` allows dynamic computation and exports, enabling `process.env` reads based on development vs production build environments."
        }
      },
      {
        heading: "Apollo Client Setup in React Native",
        text: "Setting up Apollo Client in React Native uses the same `@apollo/client` package, initializing `InMemoryCache` and `HttpLink` with the server URL.",
        codeSnippet: `import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';\nconst createApolloClient = () => {\n  return new ApolloClient({\n    uri: apolloUri,\n    cache: new InMemoryCache()\n  });\n};`,
        mcq: {
          id: "q-10.4-2-v1",
          question: "Can standard `@apollo/client` be used directly in React Native?",
          options: [
            { id: "A", text: "Yes, Apollo Client is platform-agnostic and works seamlessly in both React web and React Native" },
            { id: "B", text: "No, you must use a special native C++ rewrite" },
            { id: "C", text: "Only on iOS; Android requires REST APIs" },
            { id: "D", text: "Only when using TypeScript" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo Client works identically across web and React Native. Hooks like `useQuery` and `useMutation` function the same way in mobile apps."
        },
        retestMcq: {
          id: "q-10.4-2-v2",
          question: "Where should `<ApolloProvider client={apolloClient}>` wrap your mobile application?",
          options: [
            { id: "A", text: "At the root component of the app (e.g. in App.tsx or Main.tsx)" },
            { id: "B", text: "Inside every single FlatList row" },
            { id: "C", text: "Inside the device status bar" },
            { id: "D", text: "In the backend server file" }
          ],
          correctAnswer: "A",
          explanationNote: "Placing `ApolloProvider` at the root ensures all screens and child components have access to Apollo Client via React context."
        }
      },
      {
        heading: "Fetching Repository Lists with useQuery",
        text: "The `useQuery` hook fetches GraphQL query data on component mount, providing loading states while the mobile network request completes.",
        codeSnippet: `const { data, loading, refetch } = useQuery(GET_REPOSITORIES, {\n  fetchPolicy: 'cache-and-network'\n});\nconst repositoryNodes = data ? data.repositories.edges.map(edge => edge.node) : [];`,
        mcq: {
          id: "q-10.4-3-v1",
          question: "What does the `fetchPolicy: 'cache-and-network'` option do in Apollo Client on mobile?",
          options: [
            { id: "A", text: "It immediately returns cached data for instant UI rendering, while concurrently sending a network request to update with fresh data" },
            { id: "B", text: "It never connects to the internet" },
            { id: "C", text: "It only fetches data on Wi-Fi" },
            { id: "D", text: "It clears all cache entries immediately" }
          ],
          correctAnswer: "A",
          explanationNote: "`cache-and-network` gives fast perceived performance on mobile: cached items appear instantly on screen, then refresh automatically when the server responds."
        },
        retestMcq: {
          id: "q-10.4-3-v2",
          question: "In standard GraphQL relay-style connections (e.g. GitHub API), how are array items extracted from `repositories.edges`?",
          options: [
            { id: "A", text: "`repositories.edges.map(edge => edge.node)`" },
            { id: "B", text: "`repositories.edges.flat()`" },
            { id: "C", text: "`repositories.nodeList`" },
            { id: "D", text: "`repositories.data`" }
          ],
          correctAnswer: "A",
          explanationNote: "Relay pagination structures wrap items in an `edges` array where each element contains a `node` object holding the actual record data."
        }
      },
      {
        heading: "Formatting Numbers for Mobile UI",
        text: "Clean mobile interfaces format large metrics (e.g. 15,200 stars) into human-readable shorthand numbers (e.g. `15.2k`).",
        codeSnippet: `const formatNumber = (num: number): string => {\n  return num >= 1000 ? \`\${(num / 1000).toFixed(1)}k\` : String(num);\n};`,
        mcq: {
          id: "q-10.4-4-v1",
          question: "Why do mobile apps format large numbers (like 18450) into shorthand like '18.5k'?",
          options: [
            { id: "A", text: "To conserve limited mobile screen width and improve readability across stat badge columns" },
            { id: "B", text: "Because mobile screens cannot render 5-digit numbers" },
            { id: "C", text: "Because JavaScript numbers truncate at 1,000" },
            { id: "D", text: "It is required by GraphQL" }
          ],
          correctAnswer: "A",
          explanationNote: "Formatting thousands with 'k' keeps stat columns compact, preventing text overflow and awkward line breaks on narrow phone screens."
        },
        retestMcq: {
          id: "q-10.4-4-v2",
          question: "Given `formatNumber(850)`, what does the helper function above return?",
          options: [
            { id: "A", text: "`\"850\"`" },
            { id: "B", text: "`\"0.9k\"`" },
            { id: "C", text: "`\"850k\"`" },
            { id: "D", text: "`\"8.5k\"`" }
          ],
          correctAnswer: "A",
          explanationNote: "Since 850 is less than 1000, the condition `num >= 1000` is false and it returns the number as a plain string `\"850\"`."
        }
      },
      {
        heading: "Pull-to-Refresh with FlatList",
        text: "`FlatList` provides built-in pull-to-refresh capabilities through the `refreshing` and `onRefresh` props.",
        codeSnippet: `<FlatList\n  data={repositoryNodes}\n  renderItem={({ item }) => <RepositoryItem item={item} />}\n  refreshing={loading}\n  onRefresh={refetch}\n/>`,
        mcq: {
          id: "q-10.4-5-v1",
          question: "How do you enable native pull-to-refresh on a `FlatList` component in React Native?",
          options: [
            { id: "A", text: "Pass `refreshing={loading}` and `onRefresh={refetch}` props to `FlatList`" },
            { id: "B", text: "Install a native gesture recognizer pod" },
            { id: "C", text: "Add a button at the top of the screen" },
            { id: "D", text: "Shake the device" }
          ],
          correctAnswer: "A",
          explanationNote: "`FlatList` natively supports pull-to-refresh via `refreshing` (boolean showing the spinner) and `onRefresh` (callback to reload data)."
        },
        retestMcq: {
          id: "q-10.4-5-v2",
          question: "What native mobile UI widget appears when a user pulls down on a `FlatList` with `onRefresh` enabled?",
          options: [
            { id: "A", text: "A platform-native activity indicator spinner (e.g. Android SwipeRefreshLayout or iOS UIRefreshControl)" },
            { id: "B", text: "A browser popup alert" },
            { id: "C", text: "An error dialog" },
            { id: "D", text: "A full screen banner ad" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native delegates pull-to-refresh to the platform's native refresh indicator widget (`UIRefreshControl` on iOS)."
        }
      }
    ]
  },
  {
    id: "10-5-auth-storage-forms",
    number: "10.5",
    title: "Mobile Authentication, Storage & Form Validation",
    subtitle: "Persist authentication tokens with AsyncStorage, attach Bearer tokens via Apollo link, and validate forms.",
    readTime: "12 min",
    objectives: [
      "Persist authentication tokens across app restarts with AsyncStorage",
      "Encapsulate storage operations inside a reusable AuthStorage service class",
      "Inject authentication tokens into Apollo Client using createHttpLink and setContext",
      "Implement user login mutations and store received JWT access tokens",
      "Build type-safe mobile login forms with validation using Formik or React Hook Form with Yup/Zod",
      "Implement sign-out workflows that clear storage and reset the Apollo store"
    ],
    theoryBlocks: [
      {
        heading: "Persistent Storage with AsyncStorage",
        text: "Mobile apps do not have browser `localStorage`; they use `@react-native-async-storage/async-storage` for asynchronous key-value persistence.",
        codeSnippet: `import AsyncStorage from '@react-native-async-storage/async-storage';\n// Save item:\nawait AsyncStorage.setItem('auth-token', token);\n// Retrieve item:\nconst token = await AsyncStorage.getItem('auth-token');`,
        mcq: {
          id: "q-10.5-0-v1",
          question: "How does `AsyncStorage` differ from web browser `localStorage`?",
          options: [
            { id: "A", text: "`AsyncStorage` methods are asynchronous and return Promises, whereas `localStorage` is synchronous" },
            { id: "B", text: "`AsyncStorage` only works on Android devices" },
            { id: "C", text: "`AsyncStorage` deletes all data when the app closes" },
            { id: "D", text: "`AsyncStorage` stores data in the cloud automatically" }
          ],
          correctAnswer: "A",
          explanationNote: "Because mobile disk operations must not block the main UI thread, all `AsyncStorage` operations (`getItem`, `setItem`, `removeItem`) are async."
        },
        retestMcq: {
          id: "q-10.5-0-v2",
          question: "What storage engines back `AsyncStorage` on native platforms under the hood?",
          options: [
            { id: "A", text: "SQLite or RocksDB on Android and serialized files or dictionary storage on iOS" },
            { id: "B", text: "PostgreSQL on the device" },
            { id: "C", text: "Web cookies in Safari" },
            { id: "D", text: "RAM memory exclusively" }
          ],
          correctAnswer: "A",
          explanationNote: "`AsyncStorage` persists data to the native device file system or embedded database (SQLite on Android), retaining values across app restarts."
        }
      },
      {
        heading: "Encapsulating Storage in an AuthStorage Class",
        text: "Wrapping storage calls in an `AuthStorage` class isolates storage key details and simplifies testing and maintenance.",
        codeSnippet: `class AuthStorage {\n  constructor(namespace = 'auth') {\n    this.namespace = namespace;\n  }\n  async getAccessToken() {\n    return await AsyncStorage.getItem(\`\${this.namespace}:token\`);\n  }\n  async setAccessToken(accessToken) {\n    await AsyncStorage.setItem(\`\${this.namespace}:token\`, accessToken);\n  }\n  async removeAccessToken() {\n    await AsyncStorage.removeItem(\`\${this.namespace}:token\`);\n  }\n}`,
        mcq: {
          id: "q-10.5-1-v1",
          question: "Why is it best practice to wrap `AsyncStorage` in an `AuthStorage` class with namespaces?",
          options: [
            { id: "A", text: "It prevents key collisions and centralizes token access logic into a clean, mockable abstraction" },
            { id: "B", text: "Because AsyncStorage cannot store strings without a class" },
            { id: "C", text: "It makes the token accessible to other apps on the phone" },
            { id: "D", text: "It encrypts the entire device" }
          ],
          correctAnswer: "A",
          explanationNote: "Creating an abstraction class prevents hard-coded string key typos, isolates namespace prefixes, and makes unit testing straightforward."
        },
        retestMcq: {
          id: "q-10.5-1-v2",
          question: "How is the `AuthStorage` instance provided to child components throughout the React Native app?",
          options: [
            { id: "A", text: "Via a React Context provider (`AuthStorageContext.Provider`)" },
            { id: "B", text: "By storing it in `window.authStorage`" },
            { id: "C", text: "As a prop passed down through 50 components manually" },
            { id: "D", text: "Through an HTTP cookie" }
          ],
          correctAnswer: "A",
          explanationNote: "Creating an `AuthStorageContext` allows any hook or component in the app (like `useSignIn` or `useSignOut`) to access storage cleanly."
        }
      },
      {
        heading: "Injecting the Bearer Token into Apollo Client",
        text: "The Apollo `setContext` link asynchronously reads the access token from `authStorage` and appends it to the `authorization` header.",
        codeSnippet: `import { setContext } from '@apollo/client/link/context';\nconst authLink = setContext(async (_, { headers }) => {\n  const token = await authStorage.getAccessToken();\n  return {\n    headers: {\n      ...headers,\n      authorization: token ? \`Bearer \${token}\` : ''\n    }\n  };\n});`,
        mcq: {
          id: "q-10.5-2-v1",
          question: "Can the callback passed to `setContext` in Apollo Client be an `async` function?",
          options: [
            { id: "A", text: "Yes, `setContext` supports async functions, allowing asynchronous reads from `AsyncStorage` before requests are sent" },
            { id: "B", text: "No, Apollo links must be synchronous" },
            { id: "C", text: "Only on Web, not on React Native" },
            { id: "D", text: "Only when using GraphQL subscriptions" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo's `setContext` link natively supports promises, allowing you to await asynchronous operations like `AsyncStorage.getItem` before dispatching queries."
        },
        retestMcq: {
          id: "q-10.5-2-v2",
          question: "What must happen to the Apollo Client store when a user logs out?",
          options: [
            { id: "A", text: "`apolloClient.resetStore()` should be called to clear all cached private data from memory" },
            { id: "B", text: "The app must be uninstalled and reinstalled" },
            { id: "C", text: "The phone must be rebooted" },
            { id: "D", text: "Nothing; Apollo cache clears itself every minute" }
          ],
          correctAnswer: "A",
          explanationNote: "Calling `apolloClient.resetStore()` clears the cache and refetches active queries, preventing the next user from seeing cached private data."
        }
      },
      {
        heading: "Custom useSignIn Hook Pattern",
        text: "Encapsulating the `useMutation` call and token storage inside a custom `useSignIn` hook separates UI form components from network logic.",
        codeSnippet: `const useSignIn = () => {\n  const [mutate, result] = useMutation(AUTHENTICATE);\n  const authStorage = useAuthStorage();\n  const apolloClient = useApolloClient();\n  const signIn = async ({ username, password }) => {\n    const { data } = await mutate({ variables: { credentials: { username, password } } });\n    await authStorage.setAccessToken(data.authenticate.accessToken);\n    await apolloClient.resetStore();\n    return data;\n  };\n  return [signIn, result];\n};`,
        mcq: {
          id: "q-10.5-3-v1",
          question: "What three critical operations does the `signIn` function perform upon successful authentication?",
          options: [
            { id: "A", text: "Executes the mutation, saves the received token into storage, and resets the Apollo store" },
            { id: "B", text: "Deletes the database, restarts the phone, and closes the app" },
            { id: "C", text: "Downloads an MP3 file, plays a song, and shuts down" },
            { id: "D", text: "Converts the password into an SMS message" }
          ],
          correctAnswer: "A",
          explanationNote: "The custom hook cleanly orchestrates mutating the server, storing the returned JWT token, and resetting Apollo's cache so active queries reflect the logged-in state."
        },
        retestMcq: {
          id: "q-10.5-3-v2",
          question: "Why is separating business logic into custom hooks (like `useSignIn`) beneficial for testing?",
          options: [
            { id: "A", text: "It allows testing form presentation components independently of network requests" },
            { id: "B", text: "It makes the app run 10x faster" },
            { id: "C", text: "It disables TypeScript type checking in tests" },
            { id: "D", text: "It bypasses the need for any assertions" }
          ],
          correctAnswer: "A",
          explanationNote: "Decoupling UI forms from network mutations allows unit testing the form component with a simple mock function without needing an active GraphQL server."
        }
      },
      {
        heading: "Form Validation with Yup or Zod",
        text: "Validation schemas define field requirements (e.g. required, min/max length), displaying error feedback below inputs.",
        codeSnippet: `import * as yup from 'yup';\nconst validationSchema = yup.object().shape({\n  username: yup.string().required('Username is required'),\n  password: yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),\n});`,
        mcq: {
          id: "q-10.5-4-v1",
          question: "How does a validation schema (like Yup or Zod) enhance mobile form user experience?",
          options: [
            { id: "A", text: "It validates inputs immediately on the client side, giving instant inline error feedback without unnecessary server round-trips" },
            { id: "B", text: "It fills out the form automatically using AI" },
            { id: "C", text: "It prevents users from deleting text" },
            { id: "D", text: "It disables the submit button forever" }
          ],
          correctAnswer: "A",
          explanationNote: "Client-side schema validation immediately warns users if a password is too short or a required field is empty before making a network request."
        },
        retestMcq: {
          id: "q-10.5-4-v2",
          question: "How can you visually highlight an invalid input field in React Native when a validation error exists?",
          options: [
            { id: "A", text: "Conditionally apply an error border color: `style={[styles.input, hasError && styles.inputError]}`" },
            { id: "B", text: "Use CSS `:invalid` pseudo-class" },
            { id: "C", text: "Shake the phone with vibration" },
            { id: "D", text: "Delete the text input from the screen" }
          ],
          correctAnswer: "A",
          explanationNote: "Conditionally applying a style like `borderColor: '#d73a4a'` when an error exists gives clear, immediate visual cues to users."
        }
      },
      {
        heading: "Sign Out & Conditional Navigation Links",
        text: "The application bar checks for an authenticated user query; if authenticated, it displays a 'Sign Out' tab, otherwise 'Sign In'.",
        codeSnippet: `const { data } = useQuery(ME);\nconst currentUser = data?.me;\n// If currentUser exists -> show 'Sign Out' tab; else -> show 'Sign In' tab`,
        mcq: {
          id: "q-10.5-5-v1",
          question: "How does the mobile AppBar dynamically toggle between 'Sign In' and 'Sign Out' tabs?",
          options: [
            { id: "A", text: "By querying the currently authenticated user with a `ME` query and conditionally rendering the appropriate tab" },
            { id: "B", text: "By reading the battery level of the phone" },
            { id: "C", text: "By checking if the user is connected to Wi-Fi" },
            { id: "D", text: "By relying on a hardcoded boolean timer" }
          ],
          correctAnswer: "A",
          explanationNote: "Querying `me` through Apollo returns the user object if authenticated (or null if not), driving declarative conditional rendering in the navigation bar."
        },
        retestMcq: {
          id: "q-10.5-5-v2",
          question: "When the user taps 'Sign Out', what actions must be executed?",
          options: [
            { id: "A", text: "Remove the token from `authStorage`, reset the Apollo store with `resetStore()`, and navigate to the home screen" },
            { id: "B", text: "Delete all app source code files" },
            { id: "C", text: "Turn off device Bluetooth" },
            { id: "D", text: "Close the Expo Go application" }
          ],
          correctAnswer: "A",
          explanationNote: "Signing out requires clearing the persisted token, purging Apollo's in-memory cache, and redirecting the user to public views."
        }
      }
    ]
  },
  {
    id: "10-6-testing-native-eas-build",
    number: "10.6",
    title: "Testing, Native Features & EAS Production Builds",
    subtitle: "Test components with React Native Testing Library, access device hardware, and build release binaries with Expo EAS.",
    readTime: "12 min",
    objectives: [
      "Write unit and integration tests using @testing-library/react-native and Jest",
      "Simulate user press events and text input in native component tests",
      "Open external mobile URLs using the Linking native API",
      "Implement infinite scroll pagination with onEndReached in FlatList",
      "Configure Expo Application Services (EAS Build) with eas.json",
      "Build native standalone APKs for Android and IPA packages for iOS"
    ],
    theoryBlocks: [
      {
        heading: "Testing with React Native Testing Library",
        text: "The `@testing-library/react-native` library provides test utilities to render native components and assert on their output in Jest.",
        codeSnippet: `import { render, screen, fireEvent } from '@testing-library/react-native';\ntest('renders repository information correctly', () => {\n  render(<RepositoryItem item={mockRepo} />);\n  expect(screen.getByText('jaredpalmer/formik')).toBeDefined();\n});`,
        mcq: {
          id: "q-10.6-0-v1",
          question: "Which testing library is the industry standard for testing React Native components with Jest?",
          options: [
            { id: "A", text: "`@testing-library/react-native`" },
            { id: "B", text: "`selenium-webdriver`" },
            { id: "C", text: "`puppeteer-mobile`" },
            { id: "D", text: "`cypress-native`" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native Testing Library (`@testing-library/react-native`) renders components in a Node.js/Jest environment without needing a physical device."
        },
        retestMcq: {
          id: "q-10.6-0-v2",
          question: "How do you simulate a user typing into a `<TextInput>` in a React Native Testing Library test?",
          options: [
            { id: "A", text: "`fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');`" },
            { id: "B", text: "`screen.typeKeys('kalle')`" },
            { id: "C", text: "`input.value = 'kalle'`" },
            { id: "D", text: "`document.querySelector('input').value = 'kalle'`" }
          ],
          correctAnswer: "A",
          explanationNote: "`fireEvent.changeText` simulates the native `onChangeText` event on the target input element."
        }
      },
      {
        heading: "Simulating Presses in Tests",
        text: "Use `fireEvent.press` to simulate user taps on `Pressable` or button components and assert that submit handlers are called with correct data.",
        codeSnippet: `fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');\nfireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');\nfireEvent.press(screen.getByText('Sign in'));\nexpect(onSubmit).toHaveBeenCalledTimes(1);`,
        mcq: {
          id: "q-10.6-1-v1",
          question: "What function from React Native Testing Library simulates tapping a component?",
          options: [
            { id: "A", text: "`fireEvent.press(element)`" },
            { id: "B", text: "`fireEvent.click(element)`" },
            { id: "C", text: "`element.tap()`" },
            { id: "D", text: "`simulateTouch(element)`" }
          ],
          correctAnswer: "A",
          explanationNote: "Because mobile devices use touch events, React Native Testing Library provides `fireEvent.press` corresponding to the `onPress` prop."
        },
        retestMcq: {
          id: "q-10.6-1-v2",
          question: "Why should asynchronous tests use `waitFor(() => expect(...))` when waiting for state updates?",
          options: [
            { id: "A", text: "To poll until the expectation passes, accommodating asynchronous state updates and promises" },
            { id: "B", text: "To delay test execution by 10 minutes" },
            { id: "C", text: "Because Jest cannot run without waitFor" },
            { id: "D", text: "To prevent the terminal from scrolling" }
          ],
          correctAnswer: "A",
          explanationNote: "`waitFor` waits until asynchronous operations (like form submissions or state transitions) complete and the expectation passes."
        }
      },
      {
        heading: "Opening Web Links with Linking API",
        text: "React Native's `Linking` API allows mobile apps to open external URLs in the device's default web browser or handle deep links.",
        codeSnippet: `import { Linking } from 'react-native';\nconst openInGitHub = (url: string) => {\n  Linking.openURL(url);\n};`,
        mcq: {
          id: "q-10.6-2-v1",
          question: "Which core React Native API is used to open external web links in the system web browser?",
          options: [
            { id: "A", text: "`Linking.openURL(url)`" },
            { id: "B", text: "`window.open(url)`" },
            { id: "C", text: "`Browser.launch(url)`" },
            { id: "D", text: "`System.openBrowser(url)`" }
          ],
          correctAnswer: "A",
          explanationNote: "The `Linking` module provides a platform-independent interface to open URLs (http, mailto, tel) in the device's native browser or default app."
        },
        retestMcq: {
          id: "q-10.6-2-v2",
          question: "What does `Linking.canOpenURL(url)` allow developers to verify before calling `openURL`?",
          options: [
            { id: "A", text: "Whether an installed app on the device is registered to handle the given URL scheme" },
            { id: "B", text: "Whether the URL contains spelling errors" },
            { id: "C", text: "Whether the internet connection is faster than 10 Mbps" },
            { id: "D", text: "Whether the webpage contains JavaScript" }
          ],
          correctAnswer: "A",
          explanationNote: "`canOpenURL` checks if the device has an app capable of handling the URL scheme (e.g. `tel:`, `custom-app://`)."
        }
      },
      {
        heading: "Infinite Scrolling Pagination in FlatList",
        text: "The `onEndReached` prop in `FlatList` triggers a callback when the user scrolls near the end of the list, fetching the next page of records.",
        codeSnippet: `<FlatList\n  data={repositories}\n  renderItem={({ item }) => <RepositoryItem item={item} />}\n  onEndReached={fetchMoreRepositories}\n  onEndReachedThreshold={0.5}\n/>`,
        mcq: {
          id: "q-10.6-3-v1",
          question: "What does `onEndReachedThreshold={0.5}` specify in `FlatList`?",
          options: [
            { id: "A", text: "The callback `onEndReached` will fire when the scroll position is within half the visible list length from the bottom" },
            { id: "B", text: "It drops 50% of the items" },
            { id: "C", text: "It slows down scroll speed by 50%" },
            { id: "D", text: "It limits the list to 50 items" }
          ],
          correctAnswer: "A",
          explanationNote: "`onEndReachedThreshold: 0.5` triggers fetching when the scroll offset is within 0.5 screens of the bottom, providing seamless infinite scroll."
        },
        retestMcq: {
          id: "q-10.6-3-v2",
          question: "In Apollo Client, how do you append the newly fetched page of results to the existing cache when using infinite scrolling?",
          options: [
            { id: "A", text: "Using `fetchMore` with an `updateQuery` option or Apollo's `relayStylePagination` field policy" },
            { id: "B", text: "By reloading the browser" },
            { id: "C", text: "By clearing the cache completely" },
            { id: "D", text: "By using `localStorage.append()`" }
          ],
          correctAnswer: "A",
          explanationNote: "Apollo's `fetchMore` or field policy helper (`relayStylePagination`) merges incoming pages with existing cache items seamlessly."
        }
      },
      {
        heading: "Building Binaries with Expo Application Services (EAS)",
        text: "EAS Build compiles cloud-based native release binaries (Android `.apk`/`.aab` and iOS `.ipa`) without requiring local Xcode or Android Studio.",
        codeSnippet: `// eas.json:\n{\n  "build": {\n    "preview": {\n      "android": { "buildType": "apk" }\n    }\n  }\n}\n// Command: eas build --profile preview --platform android`,
        mcq: {
          id: "q-10.6-4-v1",
          question: "What is EAS Build in the Expo ecosystem?",
          options: [
            { id: "A", text: "A cloud-based build service that compiles standalone native app binaries (APKs/IPAs) in isolated cloud environments" },
            { id: "B", text: "A local linter for TypeScript" },
            { id: "C", text: "A replacement for React Native" },
            { id: "D", text: "A database migration tool" }
          ],
          correctAnswer: "A",
          explanationNote: "EAS Build allows any developer (including Windows and Linux users) to produce signed native Android and iOS installable app packages in the cloud."
        },
        retestMcq: {
          id: "q-10.6-4-v2",
          question: "Which file configures EAS Build profiles, environment variables, and artifact targets?",
          options: [
            { id: "A", text: "`eas.json`" },
            { id: "B", text: "`tsconfig.json`" },
            { id: "C", text: "`Dockerfile`" },
            { id: "D", text: "`vite.config.js`" }
          ],
          correctAnswer: "A",
          explanationNote: "`eas.json` defines your build profiles (development, preview, production) and credentials for building Android and iOS binaries."
        }
      },
      {
        heading: "Full Stack Open Mobile Capstone",
        text: "By completing Part 10, you have built a complete native mobile application communicating with a GraphQL backend with full state persistence, styling, and tests.",
        codeSnippet: `// Mobile Stack Overview:\n// UI: React Native + Expo + Flexbox\n// Navigation: React Router Native / React Navigation\n// Data: Apollo Client + GraphQL + AsyncStorage\n// Quality: Jest + @testing-library/react-native + EAS Build`,
        mcq: {
          id: "q-10.6-5-v1",
          question: "What is the primary advantage of learning React Native after mastering React web development in Full Stack Open?",
          options: [
            { id: "A", text: "Developers can leverage familiar React paradigms, hooks, and component lifecycles to build high-performance native iOS and Android apps" },
            { id: "B", text: "Mobile apps no longer require any backend servers" },
            { id: "C", text: "It replaces the need for any programming languages" },
            { id: "D", text: "React Native apps automatically run on microwave ovens" }
          ],
          correctAnswer: "A",
          explanationNote: "React Native bridges web and mobile: developers use their existing React, state management, and GraphQL knowledge to ship real native mobile apps."
        },
        retestMcq: {
          id: "q-10.6-5-v2",
          question: "What core architectural pattern guarantees cross-platform reliability throughout the Full Stack Open curriculum?",
          options: [
            { id: "A", text: "Declarative UI components driven by predictable state, communicating with strongly typed API contracts" },
            { id: "B", text: "Writing entire applications in a single monolithic script" },
            { id: "C", text: "Relying on global mutable variables" },
            { id: "D", text: "Avoiding automated tests" }
          ],
          correctAnswer: "A",
          explanationNote: "From React web to Express, GraphQL, TypeScript, and React Native, the core pattern remains declarative components powered by typed, predictable data flow."
        }
      }
    ]
  }
];

// Helper functions for student attempt tracking and failure streak logic
export const getLevelAttemptCountFullstackPart10 = (sectionId: string, studentId: string): number => {
  try {
    const key = `dopilot_fullstack_p10_attempt_${sectionId}_${studentId}`;
    const saved = localStorage.getItem(key);
    return saved ? Number(saved) : 1;
  } catch {
    return 1;
  }
};

export const setLevelAttemptCountFullstackPart10 = (sectionId: string, studentId: string, count: number): void => {
  try {
    const key = `dopilot_fullstack_p10_attempt_${sectionId}_${studentId}`;
    localStorage.setItem(key, String(count));
  } catch {}
};

export const getActiveQuestionsForLevelFullstackPart10 = (
  section: SectionContent,
  studentId: string,
  forceRetest: boolean = false
): McqQuestion[] => {
  const attempt = forceRetest ? 2 : getLevelAttemptCountFullstackPart10(section.id, studentId);
  return section.theoryBlocks.map((block) => {
    if (attempt >= 2 && block.retestMcq) {
      return block.retestMcq;
    }
    return block.mcq!;
  });
};

export const getConsecutiveFailedLevelsFullstackPart10 = (studentId: string): number => {
  try {
    const saved = localStorage.getItem(`dopilot_fullstack_p10_failed_levels_streak_${studentId}`);
    return saved ? Number(saved) : 0;
  } catch {
    return 0;
  }
};

export const isLevelLockedFullstackPart10 = (studentId: string): boolean => {
  try {
    return localStorage.getItem(`dopilot_fullstack_p10_locked_${studentId}`) === 'true';
  } catch {
    return false;
  }
};

export const recordLevelAttemptResultFullstackPart10 = (
  sectionId: string,
  studentId: string,
  isPassed: boolean
): {
  isPassed: boolean;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  consecutiveFailedLevels: number;
  isLocked: boolean;
} => {
  const currentAttempt = getLevelAttemptCountFullstackPart10(sectionId, studentId);

  if (isPassed) {
    try {
      localStorage.setItem(`dopilot_fullstack_p10_failed_levels_streak_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p10_consecutive_failures_${studentId}`, '0');
      localStorage.setItem(`dopilot_fullstack_p10_attempt_${sectionId}_${studentId}`, '1');
      localStorage.removeItem(`dopilot_fullstack_p10_locked_${studentId}`);
    } catch {}

    return {
      isPassed: true,
      attemptCount: currentAttempt,
      isSecondFailureInLevel: false,
      consecutiveFailedLevels: 0,
      isLocked: false
    };
  } else {
    if (currentAttempt === 1) {
      setLevelAttemptCountFullstackPart10(sectionId, studentId, 2);
      const streak = getConsecutiveFailedLevelsFullstackPart10(studentId);

      return {
        isPassed: false,
        attemptCount: 1,
        isSecondFailureInLevel: false,
        consecutiveFailedLevels: streak,
        isLocked: false
      };
    } else {
      const prevStreak = getConsecutiveFailedLevelsFullstackPart10(studentId);
      const newStreak = prevStreak + 1;
      const isLocked = newStreak >= 3;

      try {
        localStorage.setItem(`dopilot_fullstack_p10_failed_levels_streak_${studentId}`, String(newStreak));
        localStorage.setItem(`dopilot_fullstack_p10_consecutive_failures_${studentId}`, String(newStreak));
        if (isLocked) {
          localStorage.setItem(`dopilot_fullstack_p10_locked_${studentId}`, 'true');
        }
      } catch {}

      return {
        isPassed: false,
        attemptCount: 2,
        isSecondFailureInLevel: true,
        consecutiveFailedLevels: newStreak,
        isLocked
      };
    }
  }
};

export const resetConsecutiveFailuresFullstackPart10 = (studentId: string): void => {
  try {
    localStorage.setItem(`dopilot_fullstack_p10_consecutive_failures_${studentId}`, '0');
    localStorage.setItem(`dopilot_fullstack_p10_failed_levels_streak_${studentId}`, '0');
    localStorage.removeItem(`dopilot_fullstack_p10_locked_${studentId}`);
  } catch {}
};
