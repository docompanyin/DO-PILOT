// src/data/javaPart14Data.ts
// Helsinki MOOC Java Programming Part 14: Data Visualization, Multimedia, and Capstone Architecture

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

export const PART_14_SECTIONS: SectionContent[] = [
  // -------------------------------------------------------------
  // LEVEL 14.1: Data Visualization and Charts
  // -------------------------------------------------------------
  {
    id: "14-1-data-visualization",
    number: "14.1",
    title: "Data Visualization and Charts",
    subtitle: "LineChart, BarChart, PieChart, NumberAxis, CategoryAxis, and plotting XYChart.Series.",
    readTime: "25 min",
    objectives: [
      "Understand the JavaFX Charting architecture: Chart, Axis, Series, and Data points",
      "Configure numeric and categorical coordinate axes with NumberAxis and CategoryAxis",
      "Create and plot multi-series time-series line graphs using LineChart<Number, Number>",
      "Represent categorical comparisons using BarChart<String, Number>",
      "Display proportional data distributions using PieChart",
      "Update chart data dynamically in response to user events or streaming inputs"
    ],
    theoryBlocks: [
      {
        heading: "The JavaFX Chart Architecture",
        text: `Visualizing data is crucial in engineering, finance, science, and web dashboards. JavaFX provides built-in charting components in the 'javafx.scene.chart' package.\n\nCore Chart Hierarchy:\n1. 'Chart' (Abstract Base Class):\n   • 'XYChart': Base class for 2D charts with X and Y axes (LineChart, BarChart, AreaChart, ScatterChart).\n   • 'PieChart': Single circular proportional chart (does not use X/Y axes).\n\n2. 'Axis' (Coordinates):\n   • 'NumberAxis': For numeric continuous values (e.g. temperature, time, price).\n   • 'CategoryAxis': For discrete string labels (e.g. country names, product categories, months).\n\n3. 'XYChart.Series': A named collection of data points belonging to a specific dataset (e.g. \"Finland GDP\").\n4. 'XYChart.Data': An individual data point representing an '(x, y)' coordinate pair.`,
        codeSnippet: `import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.XYChart;

public class ChartSetupDemo {
    public static LineChart<Number, Number> createChart() {
        // 1. Define X and Y axes
        NumberAxis xAxis = new NumberAxis();
        xAxis.setLabel("Year");

        NumberAxis yAxis = new NumberAxis();
        yAxis.setLabel("Population (millions)");

        // 2. Create the LineChart
        LineChart<Number, Number> chart = new LineChart<>(xAxis, yAxis);
        chart.setTitle("Population Growth");

        return chart;
    }
}`,
        terminalOutput: `Chart initialized with Year (X) and Population (Y) axes.`,
        tip: "LineChart requires two type parameters matching the axis data types: 'LineChart<Number, Number>' or 'BarChart<String, Number>'.",
        mcq: {
          id: "14-1-1",
          question: "Which JavaFX axis class should be used on the X-axis when plotting discrete string categories like ['Jan', 'Feb', 'Mar']?",
          options: [
            { id: "A", text: "NumberAxis" },
            { id: "B", text: "CategoryAxis" },
            { id: "C", text: "StringAxis" },
            { id: "D", text: "LinearAxis" }
          ],
          correctAnswer: "B",
          explanationNote: "CategoryAxis is the specialized JavaFX axis used for discrete string-based categories."
        },
        questionPool: [
          {
            id: "14-1-1-alt",
            question: "What is an individual data point coordinate in a JavaFX XYChart represented as?",
            options: [
              { id: "A", text: "XYChart.Data(x, y)" },
              { id: "B", text: "Point2D(x, y)" },
              { id: "C", text: "ChartCoordinate(x, y)" },
              { id: "D", text: "Vector2(x, y)" }
            ],
            correctAnswer: "A",
            explanationNote: "Data points are instantiated using 'new XYChart.Data<>(xValue, yValue)'."
          }
        ]
      },
      {
        heading: "Plotting Line Charts with XYChart.Series",
        text: `To render curves or lines on a 'LineChart', you create one or more 'XYChart.Series' objects and add data points to them:\n\n1. Instantiate a Series: 'XYChart.Series<Number, Number> series = new XYChart.Series<>();'\n2. Set series title: 'series.setName(\"Stock A\");'\n3. Add points: 'series.getData().add(new XYChart.Data<>(x, y));'\n4. Attach series to the chart: 'lineChart.getData().add(series);'\n\nA single LineChart can hold multiple Series simultaneously, displaying comparative curves in distinct automatic colors!`,
        codeSnippet: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.chart.LineChart;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.stage.Stage;

public class LineChartApp extends Application {
    @Override
    public void start(Stage stage) {
        NumberAxis x = new NumberAxis(2020, 2024, 1);
        NumberAxis y = new NumberAxis(0, 100, 20);
        LineChart<Number, Number> chart = new LineChart<>(x, y);
        chart.setTitle("Student Mastery Index");

        XYChart.Series<Number, Number> series = new XYChart.Series<>();
        series.setName("Cohort 2024");
        series.getData().add(new XYChart.Data<>(2020, 25));
        series.getData().add(new XYChart.Data<>(2021, 48));
        series.getData().add(new XYChart.Data<>(2022, 65));
        series.getData().add(new XYChart.Data<>(2023, 82));
        series.getData().add(new XYChart.Data<>(2024, 96));

        chart.getData().add(series);

        stage.setScene(new Scene(chart, 600, 400));
        stage.show();
    }
}`,
        terminalOutput: `// Displays a 600x400 line chart plotting cohort progress from 25 to 96 across 2020-2024.`,
        tip: "You can hide the circular data point dots on a LineChart by calling 'chart.setCreateSymbols(false)' for a smoother clean line rendering.",
        mcq: {
          id: "14-1-2",
          question: "How do you add a populated dataset (Series) to a LineChart named 'chart'?",
          options: [
            { id: "A", text: "chart.plot(series)" },
            { id: "B", text: "chart.getData().add(series)" },
            { id: "C", text: "chart.setSeries(series)" },
            { id: "D", text: "chart.getChildren().add(series)" }
          ],
          correctAnswer: "B",
          explanationNote: "Charts hold an ObservableList of series accessed via chart.getData().add(series)."
        },
        questionPool: [
          {
            id: "14-1-2-alt",
            question: "Can a single JavaFX LineChart display multiple different data series simultaneously?",
            options: [
              { id: "A", text: "Yes, chart.getData().addAll(series1, series2) plots multiple distinct lines" },
              { id: "B", text: "No, each LineChart can only display one series" },
              { id: "C", text: "Only if all series have identical data points" },
              { id: "D", text: "Only in 3D mode" }
            ],
            correctAnswer: "A",
            explanationNote: "JavaFX charts easily support multiple series, automatically assigning distinct colors and legend entries to each."
          }
        ]
      },
      {
        heading: "BarChart: Comparing Discrete Categories",
        text: `'BarChart' is ideal for comparing quantities across discrete categories (e.g. sales by department, test scores by subject).\n\nSetup:\n• X-Axis: 'CategoryAxis' (discrete names)\n• Y-Axis: 'NumberAxis' (numeric quantities)\n• 'BarChart<String, Number> barChart = new BarChart<>(xAxis, yAxis);'\n\nEach data point associates a Category string with a numeric bar height: 'new XYChart.Data<>(\"Chemistry\", 92)'.`,
        codeSnippet: `import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;

public class BarChartDemo {
    public static BarChart<String, Number> createSubjectChart() {
        CategoryAxis xAxis = new CategoryAxis();
        xAxis.setLabel("Subject");

        NumberAxis yAxis = new NumberAxis(0, 100, 10);
        yAxis.setLabel("Average Score");

        BarChart<String, Number> barChart = new BarChart<>(xAxis, yAxis);
        barChart.setTitle("Class Performance");

        XYChart.Series<String, Number> series = new XYChart.Series<>();
        series.setName("Scores");
        series.getData().add(new XYChart.Data<>("Java", 95));
        series.getData().add(new XYChart.Data<>("Python", 92));
        series.getData().add(new XYChart.Data<>("Databases", 88));

        barChart.getData().add(series);
        return barChart;
    }
}`,
        terminalOutput: `BarChart constructed with 3 vertical bars: Java (95), Python (92), Databases (88).`,
        tip: "By swapping axes ('new BarChart<>(numberAxis, categoryAxis)'), you can easily generate horizontal bar charts instead of vertical ones!",
        mcq: {
          id: "14-1-3",
          question: "What generic type signature is standard for a vertical BarChart comparing subjects against scores?",
          options: [
            { id: "A", text: "BarChart<Number, Number>" },
            { id: "B", text: "BarChart<String, Number>" },
            { id: "C", text: "BarChart<Object, Object>" },
            { id: "D", text: "BarChart<Double, String>" }
          ],
          correctAnswer: "B",
          explanationNote: "A vertical bar chart has Category (String) on X and numeric values (Number) on Y: BarChart<String, Number>."
        },
        questionPool: [
          {
            id: "14-1-3-alt",
            question: "How do you disable the legend display on a JavaFX chart?",
            options: [
              { id: "A", text: "chart.setLegendVisible(false)" },
              { id: "B", text: "chart.hideLegend()" },
              { id: "C", text: "chart.deleteLegend()" },
              { id: "D", text: "chart.legend = null" }
            ],
            correctAnswer: "A",
            explanationNote: "chart.setLegendVisible(false) removes the legend box beneath or beside the chart."
          }
        ]
      },
      {
        heading: "PieChart: Proportional Distributions",
        text: `'PieChart' illustrates numerical proportions where the arc length of each slice is proportional to the quantity it represents.\n\nUnlike XYChart, PieChart does NOT use coordinate axes. Instead, it directly accepts a list of 'PieChart.Data' objects:\n\n'PieChart.Data slice = new PieChart.Data(\"Mobile\", 45);'\n\nAdding slices:\n'pieChart.getData().addAll(slice1, slice2, slice3);'\n\nJavaFX automatically calculates the total sum of all slice values, computes the respective percentages, and divides the 360-degree circle accordingly!`,
        codeSnippet: `import javafx.scene.chart.PieChart;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

public class PieChartDemo {
    public static PieChart createPlatformDistribution() {
        ObservableList<PieChart.Data> slices = FXCollections.observableArrayList(
            new PieChart.Data("Desktop Windows", 55),
            new PieChart.Data("macOS", 25),
            new PieChart.Data("Linux", 20)
        );

        PieChart pie = new PieChart(slices);
        pie.setTitle("Developer Operating Systems");
        return pie;
    }
}`,
        terminalOutput: `PieChart rendered with 3 proportional slices: Windows (55%), macOS (25%), Linux (20%).`,
        tip: "PieChart works with 'ObservableList<PieChart.Data>'. When you update a slice value in the list, the chart smoothly re-renders the slice angles live!",
        mcq: {
          id: "14-1-4",
          question: "Does a JavaFX PieChart require X and Y axis objects in its constructor?",
          options: [
            { id: "A", text: "Yes, it requires two NumberAxis objects" },
            { id: "B", text: "No, PieChart does not use axes; it takes PieChart.Data items directly" },
            { id: "C", text: "Only if the pie has more than 5 slices" },
            { id: "D", text: "Only in 3D mode" }
          ],
          correctAnswer: "B",
          explanationNote: "PieChart does not inherit from XYChart and does not use coordinate axes; slices are added directly to its data collection."
        },
        questionPool: [
          {
            id: "14-1-4-alt",
            question: "How do you create an individual slice for a JavaFX PieChart?",
            options: [
              { id: "A", text: "new PieChart.Data(\"Label\", value)" },
              { id: "B", text: "new Slice(\"Label\", value)" },
              { id: "C", text: "new Arc(\"Label\", value)" },
              { id: "D", text: "new PiePart(\"Label\", value)" }
            ],
            correctAnswer: "A",
            explanationNote: "Pie slices are created using 'new PieChart.Data(String name, double value)'."
          }
        ]
      },
      {
        heading: "Dynamic Real-Time Chart Updates",
        text: `Because JavaFX chart collections are backed by 'ObservableList', modifying the series data causes the chart to immediately and automatically refresh on screen!\n\nWhen a user clicks a button or new streaming data arrives:\n'series.getData().add(new XYChart.Data<>(newYear, newScore));'\n\nThe line or bar will animate dynamically into view without needing any manual 'repaint()' or 'redraw()' method calls!\n\nKey rule: All modifications to chart collections must happen on the JavaFX Application Thread. If data arrives from a background worker thread, wrap the update in 'Platform.runLater(() -> { ... });'.`,
        codeSnippet: `import javafx.application.Platform;
import javafx.scene.chart.XYChart;

public class DynamicUpdateHelper {
    public static void appendDataSafely(XYChart.Series<Number, Number> series, double x, double y) {
        // Ensure execution on JavaFX UI thread
        if (Platform.isFxApplicationThread()) {
            series.getData().add(new XYChart.Data<>(x, y));
        } else {
            Platform.runLater(() -> series.getData().add(new XYChart.Data<>(x, y)));
        }
    }
}`,
        terminalOutput: `Live data point appended seamlessly to chart series.`,
        tip: "Use 'Platform.runLater(Runnable)' whenever a background thread or network fetch needs to update UI controls or charts.",
        mcq: {
          id: "14-1-5",
          question: "Which method must be used to safely push chart updates to the UI from a background worker thread?",
          options: [
            { id: "A", text: "Thread.sleep()" },
            { id: "B", text: "Platform.runLater(Runnable)" },
            { id: "C", text: "System.gc()" },
            { id: "D", text: "chart.forceRedraw()" }
          ],
          correctAnswer: "B",
          explanationNote: "Platform.runLater(Runnable) queues the update task on the JavaFX Application Thread, ensuring thread-safe UI rendering."
        },
        questionPool: [
          {
            id: "14-1-5-alt",
            question: "Why do JavaFX charts automatically refresh when you call 'series.getData().add(...)'?",
            options: [
              { id: "A", text: "Because the data list is an ObservableList that fires change notifications to the chart" },
              { id: "B", text: "Because the JVM polls the array every millisecond" },
              { id: "C", text: "Because charts run an infinite while loop" },
              { id: "D", text: "Because JavaFX reloads the file from disk" }
            ],
            correctAnswer: "A",
            explanationNote: "ObservableList notifies registered listeners (the chart renderer) whenever items are added, removed, or changed."
          }
        ]
      },
      {
        heading: "Styling Charts with CSS",
        text: `JavaFX charts can be customized with CSS to achieve modern, dark-themed, or high-contrast visualizations:\n\nKey CSS Chart Selectors:\n• '.chart-title': Font, color, and padding of the chart title.\n• '.axis': Axis lines, ticks, and tick labels.\n• '.chart-series-line': Stroke color, width, and dash patterns of lines in LineChart.\n• '.chart-bar': Bar background fill, borders, and rounded corners.\n• '.chart-legend': Background and typography of the legend box.\n\nExample:\nlineChart.setStyle(\"-fx-background-color: #0b0e17;\");`,
        codeSnippet: `/* External style.css for JavaFX charts: */
.chart-title {
    -fx-font-size: 16px;
    -fx-font-weight: bold;
    -fx-text-fill: #ffffff;
}

.chart-series-line {
    -fx-stroke: #00ff9d;
    -fx-stroke-width: 3px;
}

.axis-label {
    -fx-text-fill: #a0aec0;
}`,
        terminalOutput: `Chart styled with custom glowing green stroke and modern dark theme.`,
        tip: "Styling charts through CSS keeps visual design completely separated from Java plotting logic.",
        mcq: {
          id: "14-1-6",
          question: "Which CSS class selector targets the line stroke style in a JavaFX LineChart?",
          options: [
            { id: "A", text: ".chart-series-line" },
            { id: "B", text: ".line-color" },
            { id: "C", text: ".vector-path" },
            { id: "D", text: ".line-pen" }
          ],
          correctAnswer: "A",
          explanationNote: ".chart-series-line is the official JavaFX CSS class selector for line strokes in LineChart."
        },
        questionPool: [
          {
            id: "14-1-6-alt",
            question: "How do you attach an external CSS stylesheet 'styles.css' to a JavaFX Scene?",
            options: [
              { id: "A", text: "scene.getStylesheets().add(\"styles.css\")" },
              { id: "B", text: "scene.loadCss(\"styles.css\")" },
              { id: "C", text: "scene.importStyle(\"styles.css\")" },
              { id: "D", text: "scene.css = \"styles.css\"" }
            ],
            correctAnswer: "A",
            explanationNote: "getStylesheets().add(url) attaches external CSS stylesheets to a JavaFX Scene."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 14.2: Multimedia and Audio
  // -------------------------------------------------------------
  {
    id: "14-2-multimedia",
    number: "14.2",
    title: "Multimedia and Audio in JavaFX",
    subtitle: "AudioClip for sound effects, Media, MediaPlayer, MediaView for audio/video playback, and lifecycle states.",
    readTime: "25 min",
    objectives: [
      "Play responsive low-latency sound effects using javafx.scene.media.AudioClip",
      "Understand the MediaPlayer pipeline: Media (asset), MediaPlayer (controller), and MediaView (visual display)",
      "Manage playback controls: play(), pause(), stop(), seek(), and setVolume()",
      "Handle media lifecycle states and register setOnEndOfMedia callbacks",
      "Loop background music and audio tracks using MediaPlayer.INDEFINITE",
      "Safely locate and load local file and web URL media assets without FileNotFoundExceptions"
    ],
    theoryBlocks: [
      {
        heading: "AudioClip for Low-Latency Sound Effects",
        text: `For short sound effects (button clicks, game sound effects, notification chimes), JavaFX provides 'javafx.scene.media.AudioClip'.\n\nAdvantages of AudioClip:\n• Low Latency: Audio clips are loaded and pre-decoded entirely into memory, so playback starts instantaneously with zero delay.\n• Polyphony (Multiple Concurrent Plays): Calling 'clip.play()' multiple times overlaps the sounds without cutting off earlier plays!\n• Volume & Pan Control: 'clip.setVolume(0.8)' and 'clip.setPan(0.0)'.\n• Cycle Count: 'clip.setCycleCount(3)' loops the clip 3 times.\n\nLoading:\nAudioClip clip = new AudioClip(Paths.get(\"chime.wav\").toUri().toString());\nclip.play();`,
        codeSnippet: `import javafx.scene.media.AudioClip;
import java.nio.file.Paths;

public class SoundEffectPlayer {
    private AudioClip successClip;

    public SoundEffectPlayer(String soundFilePath) {
        // Convert local disk path to URI string
        String uri = Paths.get(soundFilePath).toUri().toString();
        this.successClip = new AudioClip(uri);
        this.successClip.setVolume(0.75); // 75% volume
    }

    public void playSuccess() {
        this.successClip.play();
    }
}`,
        terminalOutput: `AudioClip loaded and ready for instantaneous playback.`,
        tip: "Use AudioClip for game sound effects, clicks, and chimes. Use MediaPlayer for longer songs, podcasts, and video files.",
        mcq: {
          id: "14-2-1",
          question: "Which JavaFX class is specifically optimized for low-latency, in-memory sound effects like button clicks and game chimes?",
          options: [
            { id: "A", text: "MediaView" },
            { id: "B", text: "AudioClip" },
            { id: "C", text: "AudioStreamer" },
            { id: "D", text: "SoundBox" }
          ],
          correctAnswer: "B",
          explanationNote: "AudioClip loads audio fully into memory for low-latency, overlapping sound effect playback."
        },
        questionPool: [
          {
            id: "14-2-1-alt",
            question: "What happens if you invoke 'audioClip.play()' twice in rapid succession?",
            options: [
              { id: "A", text: "Both audio instances play simultaneously, overlapping naturally" },
              { id: "B", text: "The first audio playback is instantly killed" },
              { id: "C", text: "It throws an AudioBusyException" },
              { id: "D", text: "The clip pauses" }
            ],
            correctAnswer: "A",
            explanationNote: "AudioClip supports simultaneous overlapping playback without interrupting earlier invocations."
          }
        ]
      },
      {
        heading: "The Media Architecture: Media, MediaPlayer, MediaView",
        text: `For longer audio tracks (MP3 songs) and video files (MP4), JavaFX uses a three-tier architecture:\n\n1. 'Media': Represents the media resource asset (URL or file URI). It contains metadata such as duration, resolution, and tracks.\nMedia media = new Media(fileUri);\n\n2. 'MediaPlayer': The playback controller. It manages playback state (playing, paused, stopped), current time position, volume, and playback speed.\nMediaPlayer player = new MediaPlayer(media);\n\n3. 'MediaView': The visual Node that renders video frames onto the Scene Graph (only required for video; audio-only files do not require a MediaView!).\nMediaView view = new MediaView(player);`,
        codeSnippet: `import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import java.nio.file.Paths;

public class MusicPlayerService {
    private MediaPlayer mediaPlayer;

    public void loadTrack(String filepath) {
        String uri = Paths.get(filepath).toUri().toString();
        Media media = new Media(uri);
        this.mediaPlayer = new MediaPlayer(media);
    }

    public void play() {
        if (mediaPlayer != null) mediaPlayer.play();
    }

    public void pause() {
        if (mediaPlayer != null) mediaPlayer.pause();
    }
}`,
        terminalOutput: `MediaPlayer initialized for long-form track playback.`,
        tip: "Notice the clean separation: Media = Resource; MediaPlayer = Logic/Controller; MediaView = Visual UI Node.",
        mcq: {
          id: "14-2-2",
          question: "When playing an audio-only MP3 file in JavaFX, which of the three media classes is NOT required?",
          options: [
            { id: "A", text: "Media" },
            { id: "B", text: "MediaPlayer" },
            { id: "C", text: "MediaView" },
            { id: "D", text: "All three are strictly mandatory" }
          ],
          correctAnswer: "C",
          explanationNote: "MediaView is only needed to render video frames onto the scene graph; audio-only playback does not need MediaView."
        },
        questionPool: [
          {
            id: "14-2-2-alt",
            question: "Which class acts as the playback controller (play, pause, stop) in the JavaFX media pipeline?",
            options: [
              { id: "A", text: "Media" },
              { id: "B", text: "MediaPlayer" },
              { id: "C", text: "MediaView" },
              { id: "D", text: "AudioClip" }
            ],
            correctAnswer: "B",
            explanationNote: "MediaPlayer provides methods like play(), pause(), stop(), and seek() to control media playback."
          }
        ]
      },
      {
        heading: "Managing Playback Controls and Volume",
        text: `The 'MediaPlayer' class gives you full programmatic control over media playback:\n\n• 'player.play()': Starts or resumes playback.\n• 'player.pause()': Pauses playback at the current timestamp.\n• 'player.stop()': Halts playback and resets time position to the beginning (time 0.0).\n• 'player.setVolume(double value)': Sets audio loudness from 0.0 (silent) to 1.0 (maximum volume).\n• 'player.seek(Duration duration)': Jumps to a specific timestamp (e.g. Duration.seconds(30)).\n• 'player.setRate(double rate)': Adjusts playback speed (e.g. 1.5x speed).`,
        codeSnippet: `import javafx.scene.media.MediaPlayer;
import javafx.util.Duration;

public class PlaybackController {
    public static void configurePlayer(MediaPlayer player) {
        player.setVolume(0.5); // 50% volume
        player.setRate(1.0);   // Normal speed

        // Jump 10 seconds into the song
        player.seek(Duration.seconds(10));
        player.play();
    }
}`,
        terminalOutput: `Player started at 10s mark with 50% volume.`,
        tip: "Volume in JavaFX is normalized between 0.0 and 1.0. Do not pass 0 to 100!",
        mcq: {
          id: "14-2-3",
          question: "What is the valid range of values for 'mediaPlayer.setVolume(double volume)'?",
          options: [
            { id: "A", text: "0 to 100" },
            { id: "B", text: "0.0 (silent) to 1.0 (maximum)" },
            { id: "C", text: "-100 to +100 decibels" },
            { id: "D", text: "1 to 10" }
          ],
          correctAnswer: "B",
          explanationNote: "JavaFX volume ranges from 0.0 (mute) to 1.0 (100% volume)."
        },
        questionPool: [
          {
            id: "14-2-3-alt",
            question: "What is the difference between 'player.pause()' and 'player.stop()'?",
            options: [
              { id: "A", text: "pause() retains the current time position; stop() halts and resets the position to the beginning" },
              { id: "B", text: "There is no difference" },
              { id: "C", text: "stop() deletes the media file from disk" },
              { id: "D", text: "pause() increases volume" }
            ],
            correctAnswer: "A",
            explanationNote: "pause() freezes playback at the current timestamp, while stop() resets playback back to time 0.0."
          }
        ]
      },
      {
        heading: "Looping and End of Media Callbacks",
        text: `Handling media completion and creating infinite background loops is common in games and ambient players:\n\n1. Looping Forever:\n'player.setCycleCount(MediaPlayer.INDEFINITE);'\nThis causes the track to automatically loop endlessly.\n\n2. 'setOnEndOfMedia' Callback:\nAllows running custom code when a track finishes (e.g. playing the next song in a playlist or showing a Game Over screen):\n\nplayer.setOnEndOfMedia(() -> {\n    System.out.println(\"Track finished! Loading next song...\");\n    playNextTrack();\n});`,
        codeSnippet: `import javafx.scene.media.MediaPlayer;

public class PlaylistManager {
    public static void setupPlaylistAutoAdvance(MediaPlayer player, Runnable nextTrackAction) {
        // Event fired when track completes playback:
        player.setOnEndOfMedia(nextTrackAction);
    }

    public static void setupLoopingBgm(MediaPlayer bgmPlayer) {
        // Loop background music indefinitely:
        bgmPlayer.setCycleCount(MediaPlayer.INDEFINITE);
        bgmPlayer.play();
    }
}`,
        terminalOutput: `Track configured for continuous background loop.`,
        tip: "MediaPlayer.INDEFINITE is the standard constant used for continuous background music in games.",
        mcq: {
          id: "14-2-4",
          question: "Which constant is passed to 'player.setCycleCount(...)' to make a track loop infinitely?",
          options: [
            { id: "A", text: "MediaPlayer.INFINITY" },
            { id: "B", text: "MediaPlayer.INDEFINITE" },
            { id: "C", text: "Integer.MAX_VALUE" },
            { id: "D", text: "-1" }
          ],
          correctAnswer: "B",
          explanationNote: "MediaPlayer.INDEFINITE instructs the player to repeat the media indefinitely."
        },
        questionPool: [
          {
            id: "14-2-4-alt",
            question: "Which callback method is triggered when a MediaPlayer reaches the end of its audio/video stream?",
            options: [
              { id: "A", text: "setOnEndOfMedia(Runnable)" },
              { id: "B", text: "onFinish()" },
              { id: "C", text: "addCompleteListener()" },
              { id: "D", text: "setFinished()" }
            ],
            correctAnswer: "A",
            explanationNote: "setOnEndOfMedia(Runnable) registers an action to be executed when the media finishes."
          }
        ]
      },
      {
        heading: "Handling Media Paths and URI Conversion",
        text: `A frequent source of errors when working with JavaFX media is passing invalid path formats. The 'Media' constructor requires a valid URI string, NOT a raw operating system file path!\n\nCorrect URI conversion pattern:\nPath path = Paths.get(\"music/song.mp3\");\nString uriString = path.toUri().toString();\nMedia media = new Media(uriString);\n\nOn Windows, 'path.toUri().toString()' converts 'C:\\\\music\\\\song.mp3' to 'file:/C:/music/song.mp3', escaping spaces and special characters properly.`,
        codeSnippet: `import javafx.scene.media.Media;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class SafeMediaLoader {
    public static Media loadLocalMedia(String relativePath) {
        Path path = Paths.get(relativePath);
        if (!Files.exists(path)) {
            throw new IllegalArgumentException("Media file not found: " + path.toAbsolutePath());
        }
        // Must convert to URI string!
        return new Media(path.toUri().toString());
    }
}`,
        terminalOutput: `File verified on disk and converted to file:/// URI string.`,
        tip: "Never pass raw strings like 'C:\\\\song.mp3' directly to 'new Media(...)'. Always use 'Paths.get(...).toUri().toString()'.",
        mcq: {
          id: "14-2-5",
          question: "What format does the 'javafx.scene.media.Media' constructor require as its parameter?",
          options: [
            { id: "A", text: "A byte array of raw audio bytes" },
            { id: "B", text: "A URI string (e.g. file:/... or https://...)" },
            { id: "C", text: "A java.io.File object" },
            { id: "D", text: "An integer file descriptor" }
          ],
          correctAnswer: "B",
          explanationNote: "The Media constructor requires a String representing a valid URI (Uniform Resource Identifier)."
        },
        questionPool: [
          {
            id: "14-2-5-alt",
            question: "How do you safely convert a java.nio.file.Path into a valid URI string for JavaFX Media?",
            options: [
              { id: "A", text: "path.toUri().toString()" },
              { id: "B", text: "path.toString()" },
              { id: "C", text: "path.getFileName()" },
              { id: "D", text: "path.toAbsolutePath()" }
            ],
            correctAnswer: "A",
            explanationNote: "path.toUri().toString() converts filesystem paths into properly formatted URI strings (e.g. file:///...)."
          }
        ]
      },
      {
        heading: "Displaying Video with MediaView",
        text: `To render video on a screen, attach the 'MediaPlayer' to a 'MediaView' Node and place the MediaView inside your Scene Graph:\n\n1. Media media = new Media(videoUri);\n2. MediaPlayer player = new MediaPlayer(media);\n3. MediaView mediaView = new MediaView(player);\n4. Configure dimensions:\n   mediaView.setFitWidth(800);\n   mediaView.setPreserveRatio(true);\n5. Attach to layout: 'root.setCenter(mediaView);'\n6. 'player.play();'`,
        codeSnippet: `import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaView;
import javafx.scene.layout.StackPane;

public class VideoPlayerDemo {
    public static StackPane createVideoPane(String videoUri) {
        Media media = new Media(videoUri);
        MediaPlayer player = new MediaPlayer(media);
        MediaView mediaView = new MediaView(player);

        mediaView.setFitWidth(640);
        mediaView.setFitHeight(360);
        mediaView.setPreserveRatio(true); // Maintain 16:9 aspect ratio

        StackPane container = new StackPane(mediaView);
        player.play();

        return container;
    }
}`,
        terminalOutput: `Video rendered inside MediaView with preserved aspect ratio.`,
        tip: "Always call 'mediaView.setPreserveRatio(true)' so video playback doesn't stretch or distort when resized.",
        mcq: {
          id: "14-2-6",
          question: "Which JavaFX Node renders video frames from a MediaPlayer onto the Scene Graph?",
          options: [
            { id: "A", text: "VideoCanvas" },
            { id: "B", text: "MediaView" },
            { id: "C", text: "ScreenPlayer" },
            { id: "D", text: "MovieBox" }
          ],
          correctAnswer: "B",
          explanationNote: "MediaView is the JavaFX scene graph Node responsible for displaying video frames."
        },
        questionPool: [
          {
            id: "14-2-6-alt",
            question: "What does 'mediaView.setPreserveRatio(true)' accomplish?",
            options: [
              { id: "A", text: "It prevents video distortion by preserving the original aspect ratio" },
              { id: "B", text: "It doubles the audio volume" },
              { id: "C", text: "It disables subtitles" },
              { id: "D", text: "It loops the video" }
            ],
            correctAnswer: "A",
            explanationNote: "Preserving aspect ratio ensures the video does not stretch awkwardly when fitWidth/fitHeight are applied."
          }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // LEVEL 14.3: Capstone Project and Real-World Java Architecture
  // -------------------------------------------------------------
  {
    id: "14-3-capstone-architecture",
    number: "14.3",
    title: "Capstone Project and Real-World Java Architecture",
    subtitle: "Multi-tiered layered architecture, unit testing, clean code, and course graduation.",
    readTime: "25 min",
    objectives: [
      "Design enterprise-grade multi-tiered systems: UI (Presentation), Service (Logic), and Data Access (Storage)",
      "Enforce single responsibility principle (SRP) and separation of concerns across packages",
      "Write comprehensive automated unit test suites using JUnit 5 assertions",
      "Apply defensive copying and immutable design patterns to protect domain state",
      "Assemble all 14 parts of Helsinki MOOC into a production-grade capstone project",
      "Graduate from Complete Java Course and claim official verified certification"
    ],
    theoryBlocks: [
      {
        heading: "Enterprise 3-Tier Layered Architecture",
        text: `Professional software systems are structured in layers to maintain order and scalability:\n\n1. Presentation Layer ('ui'):\nHandles user interaction, CLI input, or JavaFX controls. Responsible ONLY for receiving input and displaying output. Contains zero business calculations!\n\n2. Business Logic / Service Layer ('logic' / 'domain'):\nThe heart of the application. Enforces rules, workflows, validation, and calculations. Independent of any GUI or database technology!\n\n3. Data Persistence Layer ('storage' / 'dao'):\nHandles file I/O, database queries, and serialization. Responsible for saving and restoring domain entities.\n\nData flows cleanly downward: UI -> Logic -> Storage. Layers only communicate through well-defined interfaces.`,
        codeSnippet: `// 3-Tier Package Architecture:
// src/
//   ├── domain/       -> Item, User, Order (Entities)
//   ├── logic/        -> CartService, PricingEngine (Business Rules)
//   ├── storage/      -> FileStorage, OrderRepository (Persistence)
//   └── ui/           -> JavaFxApp, TerminalView (User Interface)

public class ArchitectureDemo {
    public static void main(String[] args) {
        System.out.println("Clean architecture separation enforced.");
    }
}`,
        terminalOutput: `Clean architecture separation enforced across 4 distinct packages.`,
        tip: "By isolating Business Logic from the UI, you can completely swap your GUI (e.g. from JavaFX to a Spring Boot Web REST API) without altering a single line of business logic!",
        mcq: {
          id: "14-3-1",
          question: "In standard 3-tier enterprise software architecture, which layer is strictly responsible for business rules and calculations?",
          options: [
            { id: "A", text: "Presentation / UI Layer" },
            { id: "B", text: "Business Logic / Service Layer" },
            { id: "C", text: "Data Persistence Layer" },
            { id: "D", text: "Operating System Kernel" }
          ],
          correctAnswer: "B",
          explanationNote: "The Business Logic / Service layer contains all domain rules, algorithms, and validation independently of UI or database storage."
        },
        questionPool: [
          {
            id: "14-3-1-alt",
            question: "Why should the presentation layer (UI) never directly perform file reading or database SQL queries?",
            options: [
              { id: "A", text: "It violates separation of concerns, making the UI tightly coupled to storage and untestable" },
              { id: "B", text: "Java prohibits SQL in UI classes" },
              { id: "C", text: "It doubles memory usage" },
              { id: "D", text: "Because files only exist in the logic layer" }
            ],
            correctAnswer: "A",
            explanationNote: "Coupling UI directly to storage makes maintenance difficult and prevents automated testing of logic in isolation."
          }
        ]
      },
      {
        heading: "Automated Unit Testing with JUnit",
        text: `A professional Java developer writes automated tests to verify that code works correctly and to ensure future changes do not break existing functionality.\n\nJUnit 5 Core Concepts:\n• '@Test': Marks a method as an executable test case.\n• '@BeforeEach': Runs before every individual test to set up fresh state.\n• Assertions:\n  - 'assertEquals(expected, actual)': Verifies expected value.\n  - 'assertTrue(condition)': Verifies boolean condition.\n  - 'assertNotNull(object)': Verifies reference is not null.\n  - 'assertThrows(Exception.class, executable)': Verifies that illegal operations throw the expected exception!`,
        codeSnippet: `// Example JUnit 5 Test Class:
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.BeforeEach;
// import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {
    private Calculator calc;

    // @BeforeEach
    public void setUp() {
        this.calc = new Calculator();
    }

    // @Test
    public void additionWorks() {
        // assertEquals(15, calc.add(10, 5));
    }

    // @Test
    public void divisionByZeroThrowsException() {
        // assertThrows(IllegalArgumentException.class, () -> calc.divide(10, 0));
    }
}`,
        terminalOutput: `JUnit 5: 2 tests executed, 2 passed, 0 failed. (100% Green)`,
        tip: "Unit testing gives you confidence to refactor and optimize code, knowing your test suite will instantly catch any regressions.",
        mcq: {
          id: "14-3-2",
          question: "Which JUnit assertion verifies that calling an invalid operation triggers an IllegalArgumentException?",
          options: [
            { id: "A", text: "assertException(IllegalArgumentException.class)" },
            { id: "B", text: "assertThrows(IllegalArgumentException.class, executable)" },
            { id: "C", text: "assertTrue(throw IllegalArgumentException)" },
            { id: "D", text: "expectError(IllegalArgumentException)" }
          ],
          correctAnswer: "B",
          explanationNote: "assertThrows(ExpectedException.class, Executable) verifies that executing the lambda throws the designated exception."
        },
        questionPool: [
          {
            id: "14-3-2-alt",
            question: "Which JUnit annotation specifies a method that runs before each test method to initialize test data?",
            options: [
              { id: "A", text: "@BeforeEach" },
              { id: "B", text: "@PreTest" },
              { id: "C", text: "@Init" },
              { id: "D", text: "@Start" }
            ],
            correctAnswer: "A",
            explanationNote: "@BeforeEach executes before every @Test method in the test class."
          }
        ]
      },
      {
        heading: "Defensive Copying and Immutability",
        text: `When designing domain classes, preventing external code from accidentally corrupting internal state is critical.\n\nTwo essential rules:\n1. 'Immutability': Make fields 'private final' and do not provide setter methods.\n2. 'Defensive Copying': If your class accepts or returns a mutable object (such as an ArrayList or Date):\n   • In constructor: Create a copy of the input list: 'this.items = new ArrayList<>(items);'.\n   • In getter: Return an unmodifiable view: 'return Collections.unmodifiableList(this.items);' or return a clone: 'return new ArrayList<>(this.items);'.\n\nIf you return a direct reference to an internal ArrayList, callers can call 'list.clear()' or 'list.add()' from outside, corrupting your object's invariants!`,
        codeSnippet: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class ShoppingCart {
    private final List<String> items;

    public ShoppingCart(List<String> initialItems) {
        // Defensive copy on incoming list:
        this.items = new ArrayList<>(initialItems);
    }

    public List<String> getItems() {
        // Return unmodifiable view to protect internal list:
        return Collections.unmodifiableList(this.items);
    }
}`,
        terminalOutput: `ShoppingCart cart = new ShoppingCart(List.of("Book", "Pen"));
// cart.getItems().add("Stolen Item"); -> throws UnsupportedOperationException!`,
        tip: "Collections.unmodifiableList() creates a read-only wrapper around your internal list, throwing an exception if external code attempts modification.",
        mcq: {
          id: "14-3-3",
          question: "Why should a getter return 'Collections.unmodifiableList(this.list)' instead of directly returning 'this.list'?",
          options: [
            { id: "A", text: "To protect the object's internal list from being modified or corrupted by external code" },
            { id: "B", text: "Because Java prohibits returning ArrayList from getters" },
            { id: "C", text: "To make iteration run faster" },
            { id: "D", text: "To encrypt the items" }
          ],
          correctAnswer: "A",
          explanationNote: "Returning an unmodifiable wrapper prevents callers from adding, removing, or clearing items from the internal collection."
        },
        questionPool: [
          {
            id: "14-3-3-alt",
            question: "What is defensive copying?",
            options: [
              { id: "A", text: "Creating an independent copy of a mutable object parameter so external changes do not affect internal state" },
              { id: "B", text: "Backing up files to an external SSD" },
              { id: "C", text: "Using antivirus software" },
              { id: "D", text: "Copying bytecode during class loading" }
            ],
            correctAnswer: "A",
            explanationNote: "Defensive copying clones incoming or outgoing mutable references to safeguard encapsulation."
          }
        ]
      },
      {
        heading: "Clean Code and SOLID Principles",
        text: `Writing code that merely compiles is not enough; professional code must be clean, readable, and maintainable.\n\nThe 5 SOLID Principles:\n• 'S' - Single Responsibility Principle (SRP): A class should have only one reason to change.\n• 'O' - Open/Closed Principle (OCP): Classes should be open for extension, but closed for modification.\n• 'L' - Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering program correctness.\n• 'I' - Interface Segregation Principle (ISP): Many client-specific interfaces are better than one general-purpose interface.\n• 'D' - Dependency Inversion Principle (DIP): Depend upon abstractions (interfaces), not concrete implementations.`,
        codeSnippet: `// Single Responsibility Principle:
// Class 1: User (Entity holding user data)
public record User(String id, String email) {}

// Class 2: UserRepository (Handles saving and loading users)
public interface UserRepository {
    void save(User user);
    User findById(String id);
}

// Class 3: UserNotificationService (Handles sending emails)
public class UserNotificationService {
    public void sendWelcome(User user) {
        System.out.println("Emailing: " + user.email());
    }
}`,
        terminalOutput: `Each class has exactly one clear responsibility.`,
        tip: "A class should do one thing, and do it well. If you find a class doing calculations, printing to console, and writing to disk, split it up!",
        mcq: {
          id: "14-3-4",
          question: "What does the 'Single Responsibility Principle' (SRP) state in software engineering?",
          options: [
            { id: "A", text: "A class should have only one reason to change (one focused responsibility)" },
            { id: "B", text: "A programmer can only work on one file at a time" },
            { id: "C", text: "All methods must be static" },
            { id: "D", text: "Every class must have only one constructor" }
          ],
          correctAnswer: "A",
          explanationNote: "The Single Responsibility Principle asserts that a class should perform only one cohesive responsibility, giving it only one reason to change."
        },
        questionPool: [
          {
            id: "14-3-4-alt",
            question: "Which SOLID principle suggests programming to interface abstractions rather than concrete classes?",
            options: [
              { id: "A", text: "Dependency Inversion Principle (DIP)" },
              { id: "B", text: "Single Responsibility Principle" },
              { id: "C", text: "Binary Search Principle" },
              { id: "D", text: "Recursion Principle" }
            ],
            correctAnswer: "A",
            explanationNote: "Dependency Inversion encourages high-level modules to depend on interfaces rather than low-level concrete implementations."
          }
        ]
      },
      {
        heading: "The Complete Java Capstone Project Synthesis",
        text: `Over 14 extensive parts, you have mastered the complete Java landscape:\n\n• Part 1–2: Syntax, variables, conditionals, loops, methods.\n• Part 3–4: Lists, arrays, objects, encapsulation, constructors.\n• Part 5–6: Object references, primitive vs reference types, separation of UI and domain models.\n• Part 7: Algorithms, search, sort, Comparable interface.\n• Part 8: HashMaps, equals(), hashCode(), similarity.\n• Part 9: Class inheritance, abstract classes, interfaces, polymorphism.\n• Part 10: Stream API, lambdas, method references, StringBuilder, regex, enums.\n• Part 11: Class diagrams, packages, checked/unchecked exceptions, file processing.\n• Part 12: Generics, custom collections, random numbers, 2D arrays.\n• Part 13: JavaFX GUI, layouts, event handling, multi-view navigation.\n• Part 14: Data visualization, multimedia, layered architecture, unit testing.\n\nYou now possess full-stack Java fluency capable of building production enterprise systems!`,
        codeSnippet: `public class CapstoneMastery {
    public static void main(String[] args) {
        System.out.println("=========================================");
        System.out.println("🎓 UNIVERSITY OF HELSINKI MOOC I & II 🎓");
        System.out.println("COMPLETE JAVA PROGRAMMING CURRICULUM");
        System.out.println("14 Parts • 84 Compulsory Levels • Mastered!");
        System.out.println("=========================================");
    }
}`,
        terminalOutput: `=========================================
🎓 UNIVERSITY OF HELSINKI MOOC I & II 🎓
COMPLETE JAVA PROGRAMMING CURRICULUM
14 Parts • 84 Compulsory Levels • Mastered!
=========================================`,
        tip: "Congratulations on reaching the final level of the Complete Java Course curriculum!",
        mcq: {
          id: "14-3-5",
          question: "Which Java collection should you use when you require instant O(1) average lookup of objects by a unique String key?",
          options: [
            { id: "A", text: "ArrayList" },
            { id: "B", text: "HashMap" },
            { id: "C", text: "LinkedList" },
            { id: "D", text: "Array" }
          ],
          correctAnswer: "B",
          explanationNote: "HashMap provides average O(1) constant time retrieval by hashing the key."
        },
        questionPool: [
          {
            id: "14-3-5-alt",
            question: "Which modern Java API allows declarative filtering, mapping, and reducing over collections?",
            options: [
              { id: "A", text: "The Stream API (.stream())" },
              { id: "B", text: "The Thread API" },
              { id: "C", text: "The JDBC API" },
              { id: "D", text: "The Reflection API" }
            ],
            correctAnswer: "A",
            explanationNote: "Java's Stream API introduced in Java 8 enables declarative functional pipeline processing on collections."
          }
        ]
      },
      {
        heading: "Graduation and Continuing Your Engineering Journey",
        text: `Passing Level 14.3 completes your formal training in University of Helsinki Java Programming MOOC I & II.\n\nNext Steps for Professional Growth:\n1. Build a Capstone Portfolio Project: Combine JavaFX desktop or Spring Boot web backend with PostgreSQL and the Stream API.\n2. Explore Spring Boot and Jakarta EE: The industry standard for enterprise microservices, REST APIs, and cloud services.\n3. Master Relational Databases (SQL): Write advanced queries and integrate Hibernate/JPA ORM.\n4. Claim your Official Verified DO PILOT Course Certificate of Completion from the course dashboard!\n\nWelcome to the global community of professional Java software engineers!`,
        codeSnippet: `public class GraduationSummary {
    public static void main(String[] args) {
        String graduate = "Certified Java Developer";
        boolean distinction = true;
        System.out.println("Status: " + graduate + " (Distinction: " + distinction + ")");
    }
}`,
        terminalOutput: `Status: Certified Java Developer (Distinction: true)
Ready to claim verified course certificate!`,
        tip: "Return to the Course Dashboard after completing this level to claim your verified certificate and PDF credential!",
        mcq: {
          id: "14-3-6",
          question: "What is the industry-standard Java framework most widely used for building enterprise web microservices and REST APIs?",
          options: [
            { id: "A", text: "Spring Boot" },
            { id: "B", text: "AppletViewer" },
            { id: "C", text: "Flash" },
            { id: "D", text: "Visual Basic" }
          ],
          correctAnswer: "A",
          explanationNote: "Spring Boot is by far the dominant enterprise framework for Java microservices, REST APIs, and cloud applications."
        },
        questionPool: [
          {
            id: "14-3-6-alt",
            question: "What milestone is unlocked upon completing all 14 parts of the Java curriculum with > 80% score?",
            options: [
              { id: "A", text: "The official verified Certificate of Completion with Distinction" },
              { id: "B", text: "A prompt to restart Part 1" },
              { id: "C", text: "Course access is revoked" },
              { id: "D", text: "Nothing happens" }
            ],
            correctAnswer: "A",
            explanationNote: "Completing all 14 parts awards the official verified Certificate of Completion."
          }
        ]
      }
    ]
  }
];

// Helper functions for state, pools, and streak tracking

export function getActiveQuestionsForLevelPart14(
  section: SectionContent,
  studentId: string = 'default_student',
  forceShuffle: boolean = false
): McqQuestion[] {
  const seenKey = `dopilot_java_part14_seen_${studentId}_${section.id}`;
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

export function getConsecutiveFailedLevelsPart14(studentId: string = 'default_student'): number {
  try {
    const key = `dopilot_java_part14_consecutive_failures_${studentId}`;
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    return raw ? Number(raw) : 0;
  } catch {
    return 0;
  }
}

export function resetConsecutiveFailuresPart14(studentId: string = 'default_student'): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part14_consecutive_failures_${studentId}`, '0');
    }
  } catch {}
}

export function setLevelAttemptCountPart14(sectionId: string, studentId: string = 'default_student', count: number = 1): void {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`dopilot_java_part14_attempt_${studentId}_${sectionId}`, String(count));
    }
  } catch {}
}

export function getLevelAttemptCountPart14(sectionId: string, studentId: string = 'default_student'): number {
  try {
    const raw = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(`dopilot_java_part14_attempt_${studentId}_${sectionId}`) : null;
    return raw ? Number(raw) : 1;
  } catch {
    return 1;
  }
}

export interface AttemptResultPart14 {
  consecutiveFailedLevels: number;
  attemptCount: number;
  isSecondFailureInLevel: boolean;
  isLocked: boolean;
}

export function recordLevelAttemptResultPart14(
  sectionId: string,
  studentId: string = 'default_student',
  isPassed: boolean = false
): AttemptResultPart14 {
  const attemptKey = `dopilot_java_part14_attempt_${studentId}_${sectionId}`;
  const streakKey = `dopilot_java_part14_consecutive_failures_${studentId}`;
  const lockKey = `dopilot_java_part14_locked_${studentId}`;

  let attempts = 1;
  try {
    const rawA = typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem(attemptKey) : null;
    if (rawA) attempts = Number(rawA);
  } catch {}

  let streak = getConsecutiveFailedLevelsPart14(studentId);

  if (isPassed) {
    resetConsecutiveFailuresPart14(studentId);
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
