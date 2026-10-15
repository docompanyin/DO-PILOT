// src/data/javaPart13Data.ts
// Helsinki MOOC Java Programming Part 13: Graphical User Interfaces (JavaFX), Layouts, and Event Handling

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

export const PART_13_SECTIONS: SectionContent[] = [
  // -------------------------------------------------------------
  // LEVEL 13.1: JavaFX GUI Overview and Basic Components
  // -------------------------------------------------------------
  {
    id: "13-1-javafx-components",
    number: "13.1",
    title: "JavaFX GUI Overview and Components",
    subtitle: "The Application class, Stage, Scene, launching graphical windows, and basic UI controls.",
    readTime: "25 min",
    objectives: [
      "Understand the JavaFX theater metaphor: Stage (the window), Scene (the view), and Nodes (UI elements)",
      "Inherit from javafx.application.Application and override the start(Stage stage) lifecycle method",
      "Launch JavaFX applications properly using Application.launch(args)",
      "Create and configure core UI controls: Button, Label, TextField, and TextArea",
      "Assemble components onto a Scene graph and attach it to the primary Stage",
      "Set window titles and display windows with stage.show()"
    ],
    theoryBlocks: [
      {
        heading: "The JavaFX Theater Metaphor (Stage & Scene)",
        text: `JavaFX is Java's modern framework for building cross-platform graphical desktop applications. It organizes graphics around a theater metaphor:\n\n1. 'Stage' (The Window):\nRepresents the actual operating system window, complete with title bar, minimize, maximize, and close buttons. When a JavaFX application launches, the runtime automatically creates and passes the primary Stage ('primaryStage') to your code.\n\n2. 'Scene' (The Current View):\nRepresents the visual content displayed inside the Stage. A Stage can only show one Scene at any given time, but you can swap different Scenes dynamically (e.g. login screen -> dashboard).\n\n3. 'Nodes / Controls' (The Actors):\nEvery visual element (Button, Label, TextField, Slider) is a 'Node'. Nodes are arranged hierarchically in a tree structure called the 'Scene Graph'.`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

public class HelloJavaFx extends Application {
    @Override
    public void start(Stage window) {
        // 1. Create a UI Control (Actor)
        Label message = new Label("Hello, JavaFX World!");

        // 2. Put Control inside a Scene (View) with dimensions (width x height)
        Scene scene = new Scene(message, 300, 200);

        // 3. Configure the Stage (Window)
        window.setTitle("My First Window");
        window.setScene(scene);

        // 4. Render and display the window
        window.show();
    }

    public static void main(String[] args) {
        launch(HelloJavaFx.class);
    }
}`,
        terminalOutput: `// Displays a native desktop window titled "My First Window" 
// with dimensions 300x200 showing "Hello, JavaFX World!"`,
        tip: "Remember: Stage = OS Window; Scene = Container holding the visual layout; Node = Individual controls like Buttons or Labels.",
        mcq: {
          id: "13-1-1",
          question: "In the JavaFX theater metaphor, what does the 'Stage' object represent?",
          options: [
            { id: "A", text: "A button clicked by the user" },
            { id: "B", text: "The operating system application window" },
            { id: "C", text: "A database query result set" },
            { id: "D", text: "A CSS stylesheet file" }
          ],
          correctAnswer: "B",
          explanationNote: "In JavaFX, the Stage corresponds to the native top-level operating system window."
        },
        questionPool: [
          {
            id: "13-1-1-alt",
            question: "Which lifecycle method of 'javafx.application.Application' must be overridden by a JavaFX class?",
            options: [
              { id: "A", text: "public void main(String[] args)" },
              { id: "B", text: "public void start(Stage window)" },
              { id: "C", text: "public void render()" },
              { id: "D", text: "public void initGraphics()" }
            ],
            correctAnswer: "B",
            explanationNote: "start(Stage window) is the abstract entry-point method that all JavaFX Application classes must implement."
          }
        ]
      },
      {
        heading: "Launching JavaFX Applications",
        text: `To run a JavaFX application:\n1. The main class must extend 'javafx.application.Application'.\n2. The entry point 'main(String[] args)' invokes the static helper method 'launch(args)' or 'Application.launch(MainApp.class, args)'.\n\nWhat happens during launch:\n1. The JavaFX runtime initializes the graphics subsystem.\n2. Calls the optional 'init()' method on the background thread.\n3. Switches to the specialized 'JavaFX Application Thread' (the UI event loop).\n4. Instantiates your application class and calls 'start(primaryStage)'.\n5. Remains active until 'window.close()' or 'Platform.exit()' is invoked.`,
        codeSnippet: `package mooc.ui;

import javafx.application.Application;
import javafx.stage.Stage;

public class ApplicationLauncher extends Application {
    @Override
    public void init() {
        // Runs on background initialization thread
        System.out.println("1. Initializing resources...");
    }

    @Override
    public void start(Stage stage) {
        // Runs on the JavaFX Application Thread!
        System.out.println("2. Displaying UI window...");
        stage.setTitle("Launcher Test");
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`,
        terminalOutput: `1. Initializing resources...
2. Displaying UI window...`,
        tip: "Never perform heavy network or disk operations directly inside the JavaFX Application Thread (start or event handlers), as this freezes the UI!",
        mcq: {
          id: "13-1-2",
          question: "Which static method is called inside 'main' to initiate the JavaFX runtime lifecycle?",
          options: [
            { id: "A", text: "Application.launch(args)" },
            { id: "B", text: "Stage.open(args)" },
            { id: "C", text: "System.out.render(args)" },
            { id: "D", text: "Scene.start(args)" }
          ],
          correctAnswer: "A",
          explanationNote: "launch(args) is the standard method that sets up the JavaFX runtime and calls the start() method."
        },
        questionPool: [
          {
            id: "13-1-2-alt",
            question: "On which dedicated thread does the 'start(Stage stage)' method execute in JavaFX?",
            options: [
              { id: "A", text: "The JavaFX Application Thread" },
              { id: "B", text: "The Garbage Collector thread" },
              { id: "C", text: "A raw daemon thread" },
              { id: "D", text: "The main thread" }
            ],
            correctAnswer: "A",
            explanationNote: "All UI components and the start method run on the dedicated JavaFX Application Thread."
          }
        ]
      },
      {
        heading: "Basic UI Controls: Button, Label, TextField",
        text: `JavaFX provides a rich suite of controls in the 'javafx.scene.control' package:\n\n1. 'Label': Displays non-editable static or dynamic text.\nLabel lbl = new Label(\"Username:\");\nlbl.setText(\"Updated Text\");\n\n2. 'Button': A clickable push button.\nButton btn = new Button(\"Submit\");\n\n3. 'TextField': A single-line text input field where users can type.\nTextField input = new TextField();\nString text = input.getText();\ninput.clear();\n\n4. 'TextArea': A multi-line text input area suitable for notes, logs, or code editors.`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class BasicControlsApp extends Application {
    @Override
    public void start(Stage window) {
        Label prompt = new Label("Enter your name:");
        TextField nameField = new TextField();
        Button clickMe = new Button("Greet Me");

        // Simple vertical layout container
        VBox layout = new VBox(10); // 10px spacing
        layout.getChildren().addAll(prompt, nameField, clickMe);

        Scene scene = new Scene(layout, 250, 150);
        window.setTitle("Greetings");
        window.setScene(scene);
        window.show();
    }
}`,
        terminalOutput: `// Window renders with a Label, an input field, and a clickable Button stacked vertically.`,
        tip: "To read user input from a TextField, call 'textField.getText()'. To erase previous user input, call 'textField.clear()'.",
        mcq: {
          id: "13-1-3",
          question: "Which JavaFX control allows the user to type a single line of text input?",
          options: [
            { id: "A", text: "Label" },
            { id: "B", text: "TextField" },
            { id: "C", text: "Button" },
            { id: "D", text: "Stage" }
          ],
          correctAnswer: "B",
          explanationNote: "TextField is the standard JavaFX UI component for single-line editable text input."
        },
        questionPool: [
          {
            id: "13-1-3-alt",
            question: "How do you extract the current text string typed into a TextField named 'searchBox'?",
            options: [
              { id: "A", text: "searchBox.read()" },
              { id: "B", text: "searchBox.getText()" },
              { id: "C", text: "searchBox.value()" },
              { id: "D", text: "searchBox.toString()" }
            ],
            correctAnswer: "B",
            explanationNote: "The getText() method retrieves the text currently entered into the TextField."
          }
        ]
      },
      {
        heading: "Configuring Scene Dimensions and Stage Properties",
        text: `The 'Scene' constructor accepts width and height dimensions in pixels:\nScene scene = new Scene(rootLayout, 640, 480);\n\nYou can also configure important Stage properties:\n• 'window.setTitle(\"Accounting System v2.0\")': Sets title in the OS window bar.\n• 'window.setResizable(false)': Prevents user from resizing the window.\n• 'window.setMinWidth(400); window.setMinHeight(300)': Sets minimum window boundaries.\n• 'window.show()': Makes the stage visible to the user.`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.stage.Stage;

public class WindowConfigDemo extends Application {
    @Override
    public void start(Stage window) {
        Label label = new Label("Fixed size window");
        Scene scene = new Scene(label, 400, 200);

        window.setTitle("Secure Banking Terminal");
        window.setResizable(false); // Lock window dimensions
        window.setScene(scene);
        window.show();
    }
}`,
        terminalOutput: `// Displays a 400x200 window that cannot be resized by dragging edges.`,
        tip: "If width and height parameters are omitted from the Scene constructor ('new Scene(root)'), JavaFX automatically sizes the window to fit the preferred size of its children components.",
        mcq: {
          id: "13-1-4",
          question: "Which method prevents a user from resizing a JavaFX window?",
          options: [
            { id: "A", text: "window.lockSize()" },
            { id: "B", text: "window.setResizable(false)" },
            { id: "C", text: "window.freeze(true)" },
            { id: "D", text: "window.setFixed(true)" }
          ],
          correctAnswer: "B",
          explanationNote: "window.setResizable(false) disables window resizing borders and the maximize window button."
        },
        questionPool: [
          {
            id: "13-1-4-alt",
            question: "What does 'window.show()' do in a JavaFX application?",
            options: [
              { id: "A", text: "Prints the stage memory address to terminal" },
              { id: "B", text: "Renders and displays the window on the user's screen" },
              { id: "C", text: "Compiles CSS stylesheets" },
              { id: "D", text: "Minimizes the window to the system tray" }
            ],
            correctAnswer: "B",
            explanationNote: "window.show() makes the stage visible on the desktop screen."
          }
        ]
      },
      {
        heading: "The Scene Graph Hierarchy",
        text: `JavaFX organizes all visual components into a tree structure called the 'Scene Graph'.\n\nKey terminology:\n• 'Root Node': The topmost container in the Scene (e.g. BorderPane, VBox).\n• 'Branch Nodes (Parent Nodes)': Containers that can have children (e.g. HBox, FlowPane).\n• 'Leaf Nodes': Terminal UI controls that cannot contain other nodes (e.g. Button, Label, TextField).\n\nEvery visual element in a Scene must have exactly ONE parent node. You cannot attach the same Button instance to two different layouts simultaneously!`,
        codeSnippet: `// Scene Graph Tree Hierarchy:
//           [Root: VBox]
//             /       \\
//       [Label]      [HBox]
//                    /    \\
//             [Button]   [Button]

VBox root = new VBox(10);
HBox buttonRow = new HBox(5);
buttonRow.getChildren().addAll(new Button("OK"), new Button("Cancel"));
root.getChildren().addAll(new Label("Proceed?"), buttonRow);

Scene scene = new Scene(root, 300, 150);`,
        terminalOutput: `// Hierarchy assembled successfully into Scene graph.`,
        tip: "Understanding the Scene Graph makes complex user interfaces easy: break large UIs down into nested layout branches and leaf controls.",
        mcq: {
          id: "13-1-5",
          question: "Can a single Button instance be added as a child to two different layout containers simultaneously in JavaFX?",
          options: [
            { id: "A", text: "Yes, nodes can have multiple parents in JavaFX" },
            { id: "B", text: "No, every node in a JavaFX Scene Graph can have at most one parent node" },
            { id: "C", text: "Only if the button is declared static" },
            { id: "D", text: "Only in JavaFX 21" }
          ],
          correctAnswer: "B",
          explanationNote: "The Scene Graph is a strict tree structure; each node can have at most one parent container."
        },
        questionPool: [
          {
            id: "13-1-5-alt",
            question: "In JavaFX Scene Graph terminology, what is a 'leaf node'?",
            options: [
              { id: "A", text: "A node that has no children, such as a Button or Label" },
              { id: "B", text: "The root container of the scene" },
              { id: "C", text: "An XML file" },
              { id: "D", text: "A hidden background task" }
            ],
            correctAnswer: "A",
            explanationNote: "Leaf nodes are endpoints in the scene graph that do not contain child nodes."
          }
        ]
      },
      {
        heading: "Adding Children to Layout Containers",
        text: `To attach components to a layout container, you access its children list via 'getChildren()':\n\n'layout.getChildren().add(singleNode);'\n'layout.getChildren().addAll(node1, node2, node3);'\n\nAlternatively, many layout classes (like VBox and HBox) offer constructors that accept initial children and spacing directly:\n'VBox layout = new VBox(10, label, input, button);'`,
        codeSnippet: `import javafx.scene.layout.VBox;
import javafx.scene.control.Label;
import javafx.scene.control.Button;

public class LayoutAddDemo {
    public static VBox buildForm() {
        Label heading = new Label("Feedback Form");
        Button submitBtn = new Button("Submit Now");

        VBox box = new VBox(8); // 8px vertical spacing
        // Add multiple controls in one step:
        box.getChildren().addAll(heading, submitBtn);

        return box;
    }
}`,
        terminalOutput: `Form built with 2 child nodes.`,
        tip: "Using 'addAll()' is much cleaner than calling 'add()' repeatedly for every single UI element.",
        mcq: {
          id: "13-1-6",
          question: "Which method is used on a JavaFX Pane/Layout container to retrieve its list of child nodes?",
          options: [
            { id: "A", text: "layout.getChildList()" },
            { id: "B", text: "layout.getChildren()" },
            { id: "C", text: "layout.nodes()" },
            { id: "D", text: "layout.getElements()" }
          ],
          correctAnswer: "B",
          explanationNote: "getChildren() returns an ObservableList<Node> to which child controls are added."
        },
        questionPool: [
          {
            id: "13-1-6-alt",
            question: "How can multiple nodes be added to a layout container in a single line of code?",
            options: [
              { id: "A", text: "layout.getChildren().addAll(node1, node2, node3);" },
              { id: "B", text: "layout.appendArray(node1, node2, node3);" },
              { id: "C", text: "layout.insert(node1 + node2 + node3);" },
              { id: "D", text: "layout.push(node1, node2, node3);" }
            ],
            correctAnswer: "A",
            explanationNote: "addAll() accepts varargs, allowing you to add multiple child nodes simultaneously."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 13.2: Layouts and UI Structure
  // -------------------------------------------------------------
  {
    id: "13-2-layouts-structure",
    number: "13.2",
    title: "Layouts and UI Structure",
    subtitle: "BorderPane, VBox, HBox, FlowPane, GridPane, and nesting layout containers.",
    readTime: "25 min",
    objectives: [
      "Master BorderPane's 5-region layout: Top, Bottom, Left, Right, and Center",
      "Arrange components linearly using VBox (vertical) and HBox (horizontal)",
      "Structure forms and spreadsheets using 2D coordinate-based GridPane (column, row)",
      "Use FlowPane for responsive wrapping component displays",
      "Configure padding and margins with Insets(top, right, bottom, left)",
      "Combine and nest layout containers to create professional, scalable application architectures"
    ],
    theoryBlocks: [
      {
        heading: "BorderPane: The 5-Region Master Layout",
        text: `'BorderPane' is the most widely used root layout in JavaFX. It divides the screen into 5 distinct regions:\n\n• 'Top': Typically holds menu bars, toolbars, or headers.\n• 'Bottom': Typically holds status bars, copyright, or footer buttons.\n• 'Left': Typically holds navigation sidebars or tree views.\n• 'Right': Typically holds property inspectors or secondary tools.\n• 'Center': Holds the primary content. The Center region automatically expands to fill all remaining available space!\n\nYou do not need to populate all 5 regions; unused regions collapse to zero size.`,
        codeSnippet: `import javafx.scene.layout.BorderPane;
import javafx.scene.control.Label;

public class BorderPaneDemo {
    public static BorderPane createLayout() {
        BorderPane layout = new BorderPane();

        layout.setTop(new Label("Header / Menu"));
        layout.setLeft(new Label("Navigation Sidebar"));
        layout.setCenter(new Label("Main Content Workspace (Expands)"));
        layout.setRight(new Label("Toolbox"));
        layout.setBottom(new Label("Status: Ready"));

        return layout;
    }
}`,
        terminalOutput: `BorderPane configured with Top, Left, Center, Right, Bottom.`,
        tip: "The Center region is special in BorderPane: whenever the user resizes the window, the Center expands or contracts to occupy all remaining space.",
        mcq: {
          id: "13-2-1",
          question: "Which region in a JavaFX BorderPane automatically expands to occupy all remaining unused space?",
          options: [
            { id: "A", text: "Top" },
            { id: "B", text: "Bottom" },
            { id: "C", text: "Center" },
            { id: "D", text: "Left" }
          ],
          correctAnswer: "C",
          explanationNote: "In BorderPane, the Center node expands to fill whatever space remains after the outer 4 regions are placed."
        },
        questionPool: [
          {
            id: "13-2-1-alt",
            question: "How do you set a component in the top region of a BorderPane named 'layout'?",
            options: [
              { id: "A", text: "layout.setTop(component)" },
              { id: "B", text: "layout.add(component, 0, 0)" },
              { id: "C", text: "layout.top = component" },
              { id: "D", text: "layout.getChildren().setTop(component)" }
            ],
            correctAnswer: "A",
            explanationNote: "BorderPane provides explicit setter methods: setTop(), setBottom(), setLeft(), setRight(), and setCenter()."
          }
        ]
      },
      {
        heading: "Linear Layouts: VBox and HBox",
        text: `'VBox' (Vertical Box) and 'HBox' (Horizontal Box) arrange their child nodes in a single row or column.\n\nKey features:\n• Spacing: Pass pixel spacing in the constructor: 'new HBox(15)' creates 15px gaps between items.\n• Alignment: Align children using 'layout.setAlignment(Pos.CENTER);'. Options include Pos.TOP_LEFT, Pos.CENTER, Pos.BOTTOM_RIGHT, etc.\n• Nesting: Placing an HBox inside a VBox (or inside a BorderPane region) is the standard technique for creating clean toolbars and input rows.`,
        codeSnippet: `import javafx.geometry.Pos;
import javafx.scene.control.Button;
import javafx.scene.layout.HBox;

public class ButtonBarDemo {
    public static HBox createButtonBar() {
        Button saveBtn = new Button("Save");
        Button cancelBtn = new Button("Cancel");

        HBox bar = new HBox(10); // 10px between buttons
        bar.setAlignment(Pos.CENTER_RIGHT); // Align to bottom right
        bar.getChildren().addAll(cancelBtn, saveBtn);

        return bar;
    }
}`,
        terminalOutput: `Buttons aligned horizontally with 10px spacing.`,
        tip: "Combining VBox and HBox layouts gives you 90% of the layout flexibility needed for form dialogs and settings screens.",
        mcq: {
          id: "13-2-2",
          question: "How does an 'HBox' arrange its child nodes?",
          options: [
            { id: "A", text: "Stacked vertically in a column" },
            { id: "B", text: "Arranged horizontally in a single row from left to right" },
            { id: "C", text: "In a 2D mathematical matrix" },
            { id: "D", text: "Stacked in 3D overlapping layers" }
          ],
          correctAnswer: "B",
          explanationNote: "HBox (Horizontal Box) positions all its children horizontally side-by-side in a single row."
        },
        questionPool: [
          {
            id: "13-2-2-alt",
            question: "How do you center all children inside a VBox named 'box'?",
            options: [
              { id: "A", text: "box.setAlignment(Pos.CENTER)" },
              { id: "B", text: "box.centerAll()" },
              { id: "C", text: "box.setGravity(Gravity.CENTER)" },
              { id: "D", text: "box.middle(true)" }
            ],
            correctAnswer: "A",
            explanationNote: "setAlignment(Pos.CENTER) centers all children within the container."
          }
        ]
      },
      {
        heading: "GridPane: 2D Table and Form Layouts",
        text: `'GridPane' arranges nodes in a flexible grid of rows and columns, similar to an HTML table or spreadsheet.\n\nAdding nodes with column and row coordinates:\n'grid.add(node, columnIndex, rowIndex);'\n\nNotice the order: 'columnIndex' (X-axis horizontal) comes FIRST, followed by 'rowIndex' (Y-axis vertical)! (e.g. grid.add(label, 0, 0); grid.add(textField, 1, 0);).\n\nGridPane also supports column and row spanning:\n'grid.add(node, col, row, colSpan, rowSpan);'\n\nSpacing:\n• 'grid.setHgap(10)': Horizontal gap between columns.\n• 'grid.setVgap(10)': Vertical gap between rows.`,
        codeSnippet: `import javafx.scene.layout.GridPane;
import javafx.scene.control.Label;
import javafx.scene.control.TextField;
import javafx.scene.control.Button;

public class LoginFormGrid {
    public static GridPane createLoginForm() {
        GridPane grid = new GridPane();
        grid.setHgap(10); // Gap between columns
        grid.setVgap(10); // Gap between rows

        // Column 0, Row 0:
        grid.add(new Label("Username:"), 0, 0);
        // Column 1, Row 0:
        grid.add(new TextField(), 1, 0);

        // Column 0, Row 1:
        grid.add(new Label("Password:"), 0, 1);
        // Column 1, Row 1:
        grid.add(new TextField(), 1, 1);

        // Column 1, Row 2:
        grid.add(new Button("Sign In"), 1, 2);

        return grid;
    }
}`,
        terminalOutput: `Grid created with 2 columns and 3 rows.`,
        tip: "Watch out for coordinate order: 'grid.add(node, column, row)' uses (x, y) order! Column comes before Row.",
        mcq: {
          id: "13-2-3",
          question: "In 'gridPane.add(node, 0, 2)', what do the numbers 0 and 2 specify?",
          options: [
            { id: "A", text: "Row 0, Column 2" },
            { id: "B", text: "Column 0, Row 2" },
            { id: "C", text: "Width 0px, Height 2px" },
            { id: "D", text: "Margin 0, Padding 2" }
          ],
          correctAnswer: "B",
          explanationNote: "In JavaFX GridPane.add, coordinates are specified as (column, row) — so 0 is column 0, and 2 is row 2."
        },
        questionPool: [
          {
            id: "13-2-3-alt",
            question: "Which methods set spacing between columns and rows in a GridPane?",
            options: [
              { id: "A", text: "setHgap() and setVgap()" },
              { id: "B", text: "setSpacingX() and setSpacingY()" },
              { id: "C", text: "setColumnGap() and setRowGap()" },
              { id: "D", text: "setMargins()" }
            ],
            correctAnswer: "A",
            explanationNote: "GridPane uses setHgap(pixels) for horizontal gaps and setVgap(pixels) for vertical gaps."
          }
        ]
      },
      {
        heading: "Padding and Margins with Insets",
        text: `To give UI controls breathing room and prevent them from touching the window borders, JavaFX uses 'Insets':\n\n'javafx.geometry.Insets(top, right, bottom, left)'\n\nPadding vs Margin:\n• 'Padding': Space INSIDE a container border (between the container's edge and its children):\n'layout.setPadding(new Insets(15, 20, 15, 20));'\n• Equal padding on all 4 sides: 'new Insets(15)'.\n• 'Margin': Space OUTSIDE a specific child node:\n'BorderPane.setMargin(button, new Insets(10));'`,
        codeSnippet: `import javafx.geometry.Insets;
import javafx.scene.layout.VBox;
import javafx.scene.control.Label;

public class PaddingDemo {
    public static VBox createPaddedBox() {
        VBox box = new VBox(10);
        // 20px padding from top, right, bottom, left edges:
        box.setPadding(new Insets(20));

        box.getChildren().add(new Label("Spacious content inside!"));
        return box;
    }
}`,
        terminalOutput: `Container padded with 20px on all sides.`,
        tip: "Remember the CSS clock-rule order for Insets: Top, Right, Bottom, Left (TRBL / 'Trouble').",
        mcq: {
          id: "13-2-4",
          question: "In 'new Insets(10, 20, 30, 40)', which number corresponds to the top padding?",
          options: [
            { id: "A", text: "10 (Top)" },
            { id: "B", text: "20" },
            { id: "C", text: "30" },
            { id: "D", text: "40" }
          ],
          correctAnswer: "A",
          explanationNote: "Insets arguments follow the clock order: top (10), right (20), bottom (30), left (40)."
        },
        questionPool: [
          {
            id: "13-2-4-alt",
            question: "How do you specify equal 15-pixel padding on all four sides of a layout pane?",
            options: [
              { id: "A", text: "pane.setPadding(new Insets(15));" },
              { id: "B", text: "pane.setPadding(15);" },
              { id: "C", text: "pane.addPadding(15, 15);" },
              { id: "D", text: "pane.padding = 15;" }
            ],
            correctAnswer: "A",
            explanationNote: "The single-argument Insets constructor 'new Insets(15)' applies 15px padding uniformly to top, right, bottom, and left."
          }
        ]
      },
      {
        heading: "FlowPane: Responsive Wrapping Layout",
        text: `'FlowPane' places children horizontally or vertically in a flow. When the current row fills up with components and runs out of horizontal space, FlowPane automatically wraps subsequent components to the next line!\n\nThis behavior is identical to how words wrap in a text processor or how items wrap on an e-commerce website product gallery.\n\nFlowPane is ideal for tag clouds, photo galleries, chip selectors, and responsive dashboards.`,
        codeSnippet: `import javafx.scene.layout.FlowPane;
import javafx.scene.control.Button;

public class FlowPaneDemo {
    public static FlowPane createTagList() {
        FlowPane flow = new FlowPane();
        flow.setHgap(8); // Horizontal gap between tags
        flow.setVgap(8); // Vertical gap when wrapping

        for (int i = 1; i <= 20; i++) {
            flow.getChildren().add(new Button("Tag #" + i));
        }

        return flow;
    }
}`,
        terminalOutput: `FlowPane automatically wraps buttons to new lines as window width changes.`,
        tip: "Use FlowPane whenever components should naturally flow and reflow dynamically as the user resizes the application window.",
        mcq: {
          id: "13-2-5",
          question: "What does FlowPane do when the current row runs out of horizontal space?",
          options: [
            { id: "A", text: "It clips and hides the remaining components" },
            { id: "B", text: "It automatically wraps the components onto the next line" },
            { id: "C", text: "It throws a LayoutOverflowException" },
            { id: "D", text: "It shrinks all components to zero width" }
          ],
          correctAnswer: "B",
          explanationNote: "FlowPane wraps children to a new row (or column) when space on the current line is exhausted."
        },
        questionPool: [
          {
            id: "13-2-5-alt",
            question: "Which UI layout is best suited for displaying a dynamic gallery of image thumbnails?",
            options: [
              { id: "A", text: "FlowPane" },
              { id: "B", text: "BorderPane without center" },
              { id: "C", text: "TextArea" },
              { id: "D", text: "Label" }
            ],
            correctAnswer: "A",
            explanationNote: "FlowPane gracefully wraps thumbnail elements across rows as the window width expands or contracts."
          }
        ]
      },
      {
        heading: "Nesting Layouts for Professional Architectures",
        text: `Real-world graphical interfaces are rarely built with a single layout pane; they combine nested layouts in a tree:\n\nExample Professional Layout:\n1. 'BorderPane' as the root.\n2. An 'HBox' in 'setTop()' containing navigation menu buttons.\n3. A 'GridPane' in 'setCenter()' containing form input fields.\n4. An 'HBox' in 'setBottom()' containing right-aligned 'Save' and 'Cancel' buttons.\n\nThis composability allows building scalable, clean, and responsive desktop interfaces with clear separation of visual regions.`,
        codeSnippet: `import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.GridPane;
import javafx.scene.control.Label;
import javafx.scene.control.Button;
import javafx.scene.control.TextField;
import javafx.geometry.Insets;
import javafx.geometry.Pos;

public class CompleteAppLayout {
    public static BorderPane assembleUI() {
        BorderPane root = new BorderPane();

        // Top Header HBox
        HBox topBar = new HBox(new Label("Customer Management"));
        topBar.setPadding(new Insets(10));
        root.setTop(topBar);

        // Center Form GridPane
        GridPane centerGrid = new GridPane();
        centerGrid.setHgap(10); centerGrid.setVgap(10);
        centerGrid.add(new Label("Email:"), 0, 0);
        centerGrid.add(new TextField(), 1, 0);
        root.setCenter(centerGrid);

        // Bottom Actions HBox
        HBox bottomBar = new HBox(10, new Button("Cancel"), new Button("Submit"));
        bottomBar.setAlignment(Pos.CENTER_RIGHT);
        bottomBar.setPadding(new Insets(10));
        root.setBottom(bottomBar);

        return root;
    }
}`,
        terminalOutput: `Complete hierarchical UI layout assembled cleanly.`,
        tip: "By nesting layouts, each sub-container is responsible only for its localized layout rules (e.g. HBox for button alignment, GridPane for form fields).",
        mcq: {
          id: "13-2-6",
          question: "What is the standard design approach for creating complex user interfaces in JavaFX?",
          options: [
            { id: "A", text: "Hardcoding pixel coordinates with absolute positioning everywhere" },
            { id: "B", text: "Nesting specialized layout containers (e.g. HBox and GridPane inside a BorderPane)" },
            { id: "C", text: "Creating a separate Stage window for every individual button" },
            { id: "D", text: "Drawing everything manually with pixel painting algorithms" }
          ],
          correctAnswer: "B",
          explanationNote: "Nesting layout panes creates flexible, modular, and responsive user interfaces that adapt gracefully to window resizing."
        },
        questionPool: [
          {
            id: "13-2-6-alt",
            question: "Why is absolute positioning (setLayoutX, setLayoutY) discouraged for general desktop applications?",
            options: [
              { id: "A", text: "Because it does not adapt to screen resolution, window resizing, or varying font sizes across operating systems" },
              { id: "B", text: "Because Java prohibits setLayoutX" },
              { id: "C", text: "Because it requires 100% CPU usage" },
              { id: "D", text: "Because buttons disappear on Windows" }
            ],
            correctAnswer: "A",
            explanationNote: "Absolute coordinates break whenever the window is resized or the app is displayed on different monitor DPIs."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 13.3: Event Handling and Multi-View Applications
  // -------------------------------------------------------------
  {
    id: "13-3-events-multiview",
    number: "13.3",
    title: "Event Handling and Multi-View Applications",
    subtitle: "ActionEvents, lambda listeners, dynamic UI updates, and switching Scenes on the Stage.",
    readTime: "25 min",
    objectives: [
      "Understand event-driven programming: event sources, event objects, and event listeners",
      "Attach event handlers to buttons using button.setOnAction(event -> { ... })",
      "Dynamically read user input and update UI labels in response to events",
      "Implement multi-view applications by swapping Scene objects on the Stage",
      "Separate UI view classes from domain business logic",
      "Handle numeric conversions and user validation errors gracefully in event listeners"
    ],
    theoryBlocks: [
      {
        heading: "Event-Driven Programming and setOnAction",
        text: `In traditional console programs, the program dictates execution order (read input -> calculate -> print -> exit). In GUI applications, the USER dictates the execution flow by clicking buttons, typing, or moving the mouse.\n\nThis paradigm is 'Event-Driven Programming':\n1. Event Source: The control that generates the event (e.g. a Button).\n2. Event Object: An 'ActionEvent' containing details about the action.\n3. Event Handler / Listener: Code executed when the event occurs.\n\nIn modern Java, event listeners are written concisely using lambda expressions:\n\nbutton.setOnAction(event -> {\n    System.out.println(\"Button clicked!\");\n});`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class ClickCounterApp extends Application {
    private int counter = 0;

    @Override
    public void start(Stage window) {
        Label countLabel = new Label("Clicks: 0");
        Button clickBtn = new Button("Click Me!");

        // Event listener using lambda:
        clickBtn.setOnAction(event -> {
            counter++;
            countLabel.setText("Clicks: " + counter);
        });

        VBox layout = new VBox(10, countLabel, clickBtn);
        window.setScene(new Scene(layout, 200, 100));
        window.show();
    }
}`,
        terminalOutput: `// Each time user clicks button, the label dynamically updates:
// Clicks: 1 -> Clicks: 2 -> Clicks: 3`,
        tip: "Lambda expressions '(event) -> { ... }' implement the functional interface 'EventHandler<ActionEvent>' cleanly without verbose anonymous inner classes.",
        mcq: {
          id: "13-3-1",
          question: "Which method is used on a JavaFX Button to register an event listener for click events?",
          options: [
            { id: "A", text: "button.addClickListener()" },
            { id: "B", text: "button.setOnAction(event -> ...)" },
            { id: "C", text: "button.onClick()" },
            { id: "D", text: "button.listen()" }
          ],
          correctAnswer: "B",
          explanationNote: "setOnAction(EventHandler<ActionEvent>) is the standard method for handling button clicks in JavaFX."
        },
        questionPool: [
          {
            id: "13-3-1-alt",
            question: "What functional interface does a lambda passed to 'button.setOnAction(...)' implement?",
            options: [
              { id: "A", text: "javafx.event.EventHandler<ActionEvent>" },
              { id: "B", text: "java.lang.Runnable" },
              { id: "C", text: "java.util.function.Consumer" },
              { id: "D", text: "java.awt.ActionListener" }
            ],
            correctAnswer: "A",
            explanationNote: "setOnAction expects an EventHandler<ActionEvent>, which has the single abstract method handle(ActionEvent event)."
          }
        ]
      },
      {
        heading: "Dynamic Input Processing and State Updates",
        text: `A common GUI task is reading user text, processing it, and displaying the result on screen.\n\nKey pattern:\n1. User enters text in a 'TextField'.\n2. User clicks a 'Button'.\n3. The event handler reads 'textField.getText()'.\n4. Performs calculation or transformation.\n5. Updates an output 'Label' using 'label.setText(...)'.\n6. Optionally clears the input field with 'textField.clear()'.\n\nAlways validate user inputs (e.g. wrapping 'Integer.parseInt()' in a try-catch) to prevent unhandled exceptions on invalid input!`,
        codeSnippet: `import javafx.scene.control.TextField;
import javafx.scene.control.Label;
import javafx.scene.control.Button;
import javafx.scene.layout.VBox;

public class TemperatureConverter {
    public static VBox createView() {
        TextField celsiusInput = new TextField();
        Button convertBtn = new Button("Convert to Fahrenheit");
        Label resultLabel = new Label("Result: --");

        convertBtn.setOnAction(e -> {
            try {
                double celsius = Double.parseDouble(celsiusInput.getText().trim());
                double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
                resultLabel.setText(String.format("Result: %.1f °F", fahrenheit));
            } catch (NumberFormatException ex) {
                resultLabel.setText("Please enter a valid numeric temperature!");
            }
        });

        return new VBox(8, celsiusInput, convertBtn, resultLabel);
    }
}`,
        terminalOutput: `// User enters 100 -> clicks -> Label updates to "Result: 212.0 °F"`,
        tip: "Always handle NumberFormatException inside numeric event handlers so your application gracefully alerts the user instead of failing silently in the background.",
        mcq: {
          id: "13-3-2",
          question: "How do you change the text currently displayed by a JavaFX Label named 'feedbackLabel'?",
          options: [
            { id: "A", text: "feedbackLabel.updateText(\"Hello\")" },
            { id: "B", text: "feedbackLabel.setText(\"Hello\")" },
            { id: "C", text: "feedbackLabel.text = \"Hello\"" },
            { id: "D", text: "feedbackLabel.display(\"Hello\")" }
          ],
          correctAnswer: "B",
          explanationNote: "setText(String) updates the text displayed by a Label or Button control."
        },
        questionPool: [
          {
            id: "13-3-2-alt",
            question: "Why should Double.parseDouble(input.getText()) be enclosed in a try-catch block inside an event handler?",
            options: [
              { id: "A", text: "To catch NumberFormatException if the user types letters or leaves the input blank" },
              { id: "B", text: "Because Double.parseDouble is a checked exception" },
              { id: "C", text: "To prevent memory leaks" },
              { id: "D", text: "Because JavaFX does not support floating point numbers" }
            ],
            correctAnswer: "A",
            explanationNote: "Guarding parse calls prevents application errors when users enter non-numeric text."
          }
        ]
      },
      {
        heading: "Multi-View Applications: Switching Scenes",
        text: `Most real-world applications have multiple screens or views (e.g. Login View, Main Dashboard, Settings View).\n\nIn JavaFX, the primary 'Stage' (the window) remains open, and you simply switch which 'Scene' is mounted on the stage:\n\n'window.setScene(secondScene);'\n\nPattern for multi-view navigation:\n1. Construct 'Scene loginScene = new Scene(loginLayout, 400, 300);'.\n2. Construct 'Scene dashboardScene = new Scene(dashLayout, 600, 400);'.\n3. Inside the Login button handler:\n   'loginButton.setOnAction(e -> window.setScene(dashboardScene));'\n4. Inside a Logout button handler:\n   'logoutButton.setOnAction(e -> window.setScene(loginScene));'`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class MultiViewApp extends Application {
    @Override
    public void start(Stage window) {
        // View 1
        Label view1Text = new Label("Screen 1: Welcome!");
        Button toView2 = new Button("Go to Screen 2 ->");
        VBox layout1 = new VBox(10, view1Text, toView2);
        Scene scene1 = new Scene(layout1, 300, 200);

        // View 2
        Label view2Text = new Label("Screen 2: Dashboard Content");
        Button toView1 = new Button("<- Back to Screen 1");
        VBox layout2 = new VBox(10, view2Text, toView1);
        Scene scene2 = new Scene(layout2, 300, 200);

        // Navigation Handlers:
        toView2.setOnAction(e -> window.setScene(scene2));
        toView1.setOnAction(e -> window.setScene(scene1));

        window.setScene(scene1);
        window.setTitle("Multi-View Navigator");
        window.show();
    }
}`,
        terminalOutput: `// Clicking buttons seamlessly alternates the window view between Scene 1 and Scene 2!`,
        tip: "Swapping Scenes on the primary Stage creates seamless screen transitions without annoying window open/close flickers.",
        mcq: {
          id: "13-3-3",
          question: "How do you navigate from one screen to another in a single-window JavaFX application?",
          options: [
            { id: "A", text: "Close the computer monitor" },
            { id: "B", text: "Call window.setScene(newScene) on the primary Stage" },
            { id: "C", text: "Restart the application" },
            { id: "D", text: "Call System.exit(0)" }
          ],
          correctAnswer: "B",
          explanationNote: "Calling stage.setScene(anotherScene) swaps the active view in the existing window immediately."
        },
        questionPool: [
          {
            id: "13-3-3-alt",
            question: "Can two different Scene instances share the exact same Button instance?",
            options: [
              { id: "A", text: "No, a node can only be part of one scene graph at a time" },
              { id: "B", text: "Yes, buttons are shared automatically" },
              { id: "C", text: "Only in JavaFX 11" },
              { id: "D", text: "Yes, if the button has no text" }
            ],
            correctAnswer: "A",
            explanationNote: "A Node can belong to only one Scene and parent container at any time."
          }
        ]
      },
      {
        heading: "Separating UI and Application Logic",
        text: `Writing business logic directly inside GUI event handlers leads to 'spaghetti code' that is impossible to test, maintain, or reuse.\n\nClean Architecture Separation:\n1. 'Domain / Logic Layer': Independent plain Java classes (POJOs) with no JavaFX imports (e.g. 'Calculator', 'UserDatabase', 'Cart'). This layer can be unit-tested thoroughly with JUnit!\n2. 'UI / View Layer': JavaFX classes responsible only for rendering controls, capturing user clicks, and passing data to the Domain layer.\n\nThe UI class holds a reference to the Logic class and calls its methods when events fire.`,
        codeSnippet: `// 1. PURE DOMAIN LOGIC (No JavaFX imports, 100% unit-testable!)
public class ClickCounterLogic {
    private int value;
    public void increment() { this.value++; }
    public int getValue() { return this.value; }
}

// 2. GUI VIEW CLASS
public class CounterView {
    private ClickCounterLogic logic;

    public CounterView(ClickCounterLogic logic) {
        this.logic = logic;
    }

    public VBox getView() {
        Label label = new Label("Count: " + logic.getValue());
        Button btn = new Button("Count");
        btn.setOnAction(e -> {
            logic.increment();
            label.setText("Count: " + logic.getValue());
        });
        return new VBox(10, label, btn);
    }
}`,
        terminalOutput: `Domain logic decoupled cleanly from JavaFX view layer.`,
        tip: "If you cannot write a JUnit test for your calculation without launching a JavaFX window, your business logic is too tightly coupled to your GUI!",
        mcq: {
          id: "13-3-4",
          question: "Why should business logic (e.g. tax calculations, data storage) be separated from JavaFX UI classes?",
          options: [
            { id: "A", text: "To make the application logic reusable, maintainable, and independently unit-testable" },
            { id: "B", text: "Because JavaFX does not allow math operations" },
            { id: "C", text: "To increase file size" },
            { id: "D", text: "Because GUI classes cannot use variables" }
          ],
          correctAnswer: "A",
          explanationNote: "Separating domain logic from UI makes the code modular, easier to maintain, and testable with automated unit tests without requiring a GUI window."
        },
        questionPool: [
          {
            id: "13-3-4-alt",
            question: "Should pure domain model classes import 'javafx.*' packages?",
            options: [
              { id: "A", text: "No, domain models should remain independent of any specific UI framework" },
              { id: "B", text: "Yes, every Java class must import JavaFX" },
              { id: "C", text: "Only if they contain numbers" },
              { id: "D", text: "Yes, for serialization" }
            ],
            correctAnswer: "A",
            explanationNote: "Domain models should be pure Java with zero GUI dependencies, ensuring they can be used with web APIs, CLI tools, or mobile apps."
          }
        ]
      },
      {
        heading: "Handling Keyboard and Text Change Events",
        text: `Beyond button clicks, JavaFX allows listening to keystrokes and real-time text modifications:\n\n1. 'textProperty().addListener(...)':\nListens to live text edits in a TextField character-by-character as the user types!\n\ntextField.textProperty().addListener((observable, oldValue, newValue) -> {\n    mirrorLabel.setText(\"You typed: \" + newValue);\n});\n\n2. Keyboard Key Events:\n'scene.setOnKeyPressed(event -> {\n    if (event.getCode() == KeyCode.ENTER) { submit(); }\n});'`,
        codeSnippet: `import javafx.scene.control.TextField;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class LiveSearchDemo {
    public static VBox createSearchBox() {
        TextField searchField = new TextField();
        Label characterCount = new Label("Characters: 0");

        // Real-time listener on text property:
        searchField.textProperty().addListener((obs, oldText, newText) -> {
            characterCount.setText("Characters: " + newText.length());
        });

        return new VBox(10, searchField, characterCount);
    }
}`,
        terminalOutput: `// As user types "Java", the label immediately updates: Characters: 4`,
        tip: "Listening to 'textProperty()' is perfect for search auto-complete, password strength meters, and live character counters.",
        mcq: {
          id: "13-3-5",
          question: "Which mechanism allows executing code in real-time on every single character keystroke typed into a TextField?",
          options: [
            { id: "A", text: "textField.setOnAction()" },
            { id: "B", text: "textField.textProperty().addListener((obs, oldVal, newVal) -> ...)" },
            { id: "C", text: "textField.wait()" },
            { id: "D", text: "textField.loop()" }
          ],
          correctAnswer: "B",
          explanationNote: "Attaching a ChangeListener to textProperty() triggers on every modification to the text content."
        },
        questionPool: [
          {
            id: "13-3-5-alt",
            question: "When is the event registered with 'textField.setOnAction(...)' triggered?",
            options: [
              { id: "A", text: "When the user presses the ENTER key while the TextField has focus" },
              { id: "B", text: "On every mouse move" },
              { id: "C", text: "When the window is closed" },
              { id: "D", text: "When the text is cleared" }
            ],
            correctAnswer: "A",
            explanationNote: "For a TextField, setOnAction fires when the user presses Enter while typing inside the field."
          }
        ]
      },
      {
        heading: "Styling with CSS in JavaFX",
        text: `JavaFX features full support for styling user interfaces using Cascading Style Sheets (CSS)!\n\nJavaFX CSS properties are prefixed with '-fx-':\n• '-fx-font-size: 16px;'\n• '-fx-background-color: #2b2b2b;'\n• '-fx-text-fill: white;'\n• '-fx-padding: 10px;'\n\nYou can set styles inline with 'node.setStyle(\"-fx-font-size: 18px;\")' or link an external '.css' stylesheet file:\n'scene.getStylesheets().add(\"style.css\");'.`,
        codeSnippet: `import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;

public class CssStylingDemo {
    public static VBox createStyledCard() {
        Label title = new Label("Dark Mode Card");
        title.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #00ff9d;");

        Button actionBtn = new Button("Confirm Action");
        actionBtn.setStyle("-fx-background-color: #00ff9d; -fx-text-fill: #000000; -fx-font-weight: 800;");

        VBox box = new VBox(12, title, actionBtn);
        box.setStyle("-fx-background-color: #121620; -fx-padding: 20px; -fx-background-radius: 12px;");

        return box;
    }
}`,
        terminalOutput: `// Card rendered with modern dark mode colors and rounded corners!`,
        tip: "JavaFX CSS property names start with '-fx-' (e.g. -fx-background-color, -fx-font-size, -fx-text-fill).",
        mcq: {
          id: "13-3-6",
          question: "What prefix is used for CSS styling properties in JavaFX?",
          options: [
            { id: "A", text: "-java-" },
            { id: "B", text: "-fx-" },
            { id: "C", text: "-gui-" },
            { id: "D", text: "-style-" }
          ],
          correctAnswer: "B",
          explanationNote: "JavaFX CSS properties are namespaced with the '-fx-' prefix (e.g. -fx-background-color)."
        },
        questionPool: [
          {
            id: "13-3-6-alt",
            question: "How do you set text color on a JavaFX Label using inline CSS?",
            options: [
              { id: "A", text: "label.setStyle(\"-fx-text-fill: red;\")" },
              { id: "B", text: "label.setStyle(\"color: red;\")" },
              { id: "C", text: "label.setColor(\"red\")" },
              { id: "D", text: "label.paint(\"red\")" }
            ],
            correctAnswer: "A",
            explanationNote: "In JavaFX CSS, font/text color is controlled by the property '-fx-text-fill'."
          }
        ]
      }
    ]
  }
];

// Helper functions for state, pools, and streak tracking

export function getActiveQuestionsForLevelPart13(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part13_seen_${studentId}_${section.id}`;
  let seenIds: string[] = [];
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(seenKey) : null;
    if (raw) seenIds = JSON.parse(raw);
  } catch {}

  const activeQuestions: McqQuestion[] = [];

  section.theoryBlocks.forEach((block) => {
    const pool = [block.mcq, ...(block.questionPool || []), block.retestMcq].filter(Boolean) as McqQuestion[];
    if (pool.length === 0) return;

    if (forceShuffle) {
      const unseen = pool.filter(q => q.id && !seenIds.includes(q.id));
      if (unseen.length > 0) {
        const picked = unseen[Math.floor(Math.random() * unseen.length)];
        activeQuestions.push(picked);
        if (picked.id) seenIds.push(picked.id);
      } else {
        // Alternative question or pool[1] if available, otherwise pool[0]
        const alt = pool.length > 1 ? pool[1] : pool[0];
        activeQuestions.push(alt);
      }
    } else {
      activeQuestions.push(pool[0]);
      if (pool[0].id && !seenIds.includes(pool[0].id)) {
        seenIds.push(pool[0].id);
      }
    }
  });

  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(seenKey, JSON.stringify(seenIds));
    }
  } catch {}

  return activeQuestions;
}

export function getConsecutiveFailedLevelsPart13(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part13_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart13(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part13_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart13(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part13_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart13(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part13_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart13 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart13(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart13 {
  const attemptKey = `dopilot_java_part13_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part13_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part13_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart13(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart13(studentId);
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(attemptKey);
      }
    } catch {}
    return {
      consecutiveFailedLevels: 0,
      attemptCount: attempts,
      isSecondFailureInLevel: false,
      isLocked: false
    };
  } else {
    const isSecondFailure = attempts >= 2;
    if (isSecondFailure) {
      streak += 1;
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem(streakKey, String(streak));
        }
      } catch {}
    }

    const isLocked = streak >= 3;
    if (isLocked) {
      try {
        if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
          localStorage.setItem(lockKey, 'true');
        }
      } catch {}
    }

    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(attemptKey, String(attempts + 1));
      }
    } catch {}

    return {
      consecutiveFailedLevels: streak,
      attemptCount: attempts,
      isSecondFailureInLevel: isSecondFailure,
      isLocked
    };
  }
}
