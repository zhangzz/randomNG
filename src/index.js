$(function() {
  $('#tabs').tabs();
  $('button').button().click(App.on_button_click);
  App.ui_init();
  App.pool_show('#r1', App.pool);
  App.pool_show('#r2', App.pool);
  App.pool_show('#r3', App.pool);
});

var App = {
  grouping_grp_sizes: [],
  pool: ['莎士比亚', '马克•吐温', '叶芝', '雨果', '歌德', '钱钟书', '莫言', '张学友', '蔡琴', '周星驰'
            , '周润发', '谭咏麟', '张雨生', '童安格', '崔健', '王菲', '马三立', '刘宝瑞', '袁阔成', '侯宝林'
            , '郭启儒', '姜昆', '唐杰忠', '林肯', '华盛顿', '杰斐逊', '罗斯福', '邱吉尔', '韦小宝', '张无忌'
            , '郭靖', '黄蓉', '周伯通', '丘处机', '柯镇恶', '石破天', '白自在', '黄药师', '欧阳锋', '杨过'],
  pool_show: function(wrapper_id, pool) {
    var $p = $(wrapper_id).empty();
    for (var i = 0, len = pool.length; i < len; i++) {
      $('<div/>', {text: pool[i],
        'class': 'r1-item',
        'data-i': i}).appendTo($p);
    }
    $('#r1-chosen').empty();
    App.display_st_count();
    App.bind_r2_item_click();
  },
  ui_init: function() {
    var s = App.pool.join('\n');
    $('#taPool').val(s).unbind()
            .bind('blur', function() {
      var lines = $(this).val().split('\n');
      var temp = '';
      App.pool = [];
      for (var i = 0, len = lines.length; i < len; i++) {
        temp = lines[i];
        if ($.trim(temp) === '')
          continue;
        else
          App.pool.push(temp);
      }
      App.pool_show('#r1', App.pool);
      App.pool_show('#r2', App.pool);
      //alert(App.pool.join('; '));
    });
  },
  item_rand_mark: function(wrapper_id) {
    wrapper_id = wrapper_id || '#r1';
    var count = $(wrapper_id + ' .r1-item').length;
    var i = Math.floor(Math.random() * count);
    $(wrapper_id + ' .r1-item').removeClass('r1-selected');
    var e = $(wrapper_id + ' .r1-item')[i];
    $(e).addClass('r1-selected');
    //$('#r1 .r1-item[data-i=' + i + ']').addClass('r1-selected');
    //console.log('rand show index=' + i);
  },
  item_rand_mark_in_secs: function(wrapper_id, times, done_call) {
    wrapper_id = wrapper_id || '#r1';
    var count = 0;
    var id = setInterval(function() {
      App.item_rand_mark(wrapper_id);
      count++;
      if (count >= times) {
        clearInterval(id);
        //alert('done');
        if (done_call)
          done_call();
      }
    }, 20);
  },
  file2: function() {
    var fs = require('fs');
    fs.writeFile("/tmp/test", "Hey there!", function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("The file was saved!");
      }
    });
  },
  read_file: function() {
    fs = require('fs')
    fs.readFile('c:/1.txt', 'utf8', function(err, data) {
      if (err) {
        alert(JSON.stringify(err));
      }
      alert(data);
    });
  },
  display_st_count: function() {
    var c = $('#r1 .r1-item').length;
    $('#sp-r1,#sp-r3').text(c);
    c = $('#r2 .r1-item').length;
    var c1 = $('#r2-chosen .r1-item').length;
    $('#sp-r2').text(c + '-' + c1);
  },
  bind_r2_item_click: function() {
    $('#r2 .r1-item, #r2-chosen .r1-item')
            .unbind()
            .click(App.on_r2_item_click);
  },
  on_r2_item_click: function() {
    var $me = $(this);
    var pchosen = $me.parent('#r2-chosen');
    if (pchosen.length > 0) {
      //right, chosen
      $me.removeClass('r1-selected').appendTo('#r2');
    }
    else {
      $me.addClass('r1-selected').prependTo('#r2-chosen');
    }
    App.display_st_count();
  },
  on_button_click: function() {
    var $me = $(this);
    var cmd = $me.attr('data-cmd');
    if (cmd === 'r1-reset') {
      App.pool_show('#r1', App.pool);
    }
    else if (cmd === 'r1-mark-one') {
      var count = $('#r1 .r1-item').length;
      App.item_rand_mark_in_secs('#r1', count);
    }
    else if (cmd === 'r2-reset') {
      $('#r2-chosen').empty();
      App.pool_show('#r2', App.pool);
    }
    else if (cmd === 'choose-one') {
      App.item_rand_mark_in_secs('#r2', 20, function() {
        $('#r2 .r1-selected').prependTo($('#r2-chosen'));
        App.display_st_count();
        App.bind_r2_item_click();
      });
    }
    else if (cmd === 'choose-two') {
      for (var i = 0; i < 2; i++) {
        App.item_rand_mark_in_secs('#r2', 20, function() {
          $('#r2 .r1-selected')
                  .prependTo($('#r2-chosen'));
          App.display_st_count();
        });
      }
    }
    else if (cmd === 'choose-three') {
      for (var i = 0; i < 3; i++) {
        App.item_rand_mark_in_secs('#r2', 20, function() {
          $('#r2 .r1-selected')
                  .prependTo($('#r2-chosen'));
          App.display_st_count();
        });
      }
    }
    else if (cmd === 'grouping') {
      App.grouping();
    }
    else if (cmd === 'r3-reset') {
      App.pool_show('#r3', App.pool);
      $('#r3-group-wrapper').empty();
    }
    else if (cmd === 'grp-expand-all') {
      App.group_expand_all();
    }
    else if (cmd === 'grp-fold-all') {
      App.group_fold_all();
    }
    else if (cmd === 'grp-copy-text') {
      App.group_copy_text();
    }
    return false;
  },
  grouping: function() {
    //groupingDlg
    $('#groupingDlg').dialog({
      title: '随机分组设置',
      modal: true,
      width: 610,
      height: 550,
      buttons: {
        'OK': function() {
          App.grouping_action(App.grouping_grp_sizes);
          $(this).dialog('close');
        },
        'Cancel': function() {
          $(this).dialog('close');
        }
      }
    });
    App.dlg_grouping_init();
  },
  dlg_grouping_init: function() {
    $('#tbGrouping')
            .unbind()
            .keyup(function() {
      //alert('changed');
      var t = $(this).val();
      var ns = t.split(' ');
      var grp_sizes = [];
      var size = -1;
      var sum = 0;
      for (var i = 0, len = ns.length; i < len; i++) {
        size = parseInt(ns[i]);
        if (size > 0) {
          grp_sizes.push(size);
        }
      }
      //$('#grouingInfo').text(grp_sizes.join(' '));
      var info = [];
      if (grp_sizes.length === 0) {
        info.push('请输入每组的人数，用空格分开。');
      }
      else {
        sum = 0;
        for (var i = 0, len = grp_sizes.length; i < len; i++) {
          size = grp_sizes[i];
          info.push('第' + (i + 1) + '组，' + size + '人。');
          sum += size;
        }
        info.push('已分组：' + sum + '人');
        info.push('剩余：' + ($('#r3 .r1-item').length - sum) + '人');
        $('#grouingInfo').html(info.join('<br>'));
      }
      App.grouping_grp_sizes = grp_sizes;
    });
  },
  grouping_action: function(grp_sizes) {
    var count = grp_sizes.length;
    var i = 0, j = 0;
    var $p = $('#r3-group-wrapper');//.empty();
    var $g = null;
    var exist_grps = $('.group-title').length;
    for (i = exist_grps; i < exist_grps + count; i++) {
      //create UI
      $('<div/>', {'class': 'group-title',
        text: (i + 1) + '组，' + grp_sizes[i - exist_grps] + '人',
        title: '点击隐藏或显示成员。',
        'data-i': i}).appendTo($p);
      $g = $('<div/>', {'class': 'group-content',
        'data-i': i}).appendTo($p);
      for (j = 0; j < grp_sizes[i - exist_grps]; j++) {
        App.item_rand_mark('#r3');
        $('#r3 .r1-selected')
                .appendTo($g);
      }
      $('<div style="clear:both;"/>').appendTo($g);
    }
    $('.group-title').unbind().click(function() {
      $(this).next().slideToggle();
    });
    //generate members

  },
  group_fold_all: function() {
    $('.group-title').each(function() {
      $(this).next().slideUp();
    });
  },
  group_expand_all: function() {
    $('.group-title').each(function() {
      $(this).next().slideDown();
    });
  },
  group_copy_text: function() {
    var buffer = [];
    var $me = null;
    $('#r3-group-wrapper .group-title, #r3-group-wrapper .r1-item').each(function() {
      $me = $(this);
      if ($me.hasClass('group-title')) {
        buffer.push(' ');
      }
      buffer.push($me.text());
      if ($me.hasClass('group-title')) {
        buffer.push('---------------------');
      }
    });

    var $dlg = $('<div/>')
            .dialog({title: '分组情况',
      'modal': true,
      width: 600,
      height: 500
    });
    $('<textarea/>', {text: buffer.join('\n'), style: 'width:550px;height:400px;'}).appendTo($dlg);
  }
};

